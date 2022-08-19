// imports express this is used to handle routes and generally make node a more polite friend
const express = require('express')
// sets out app var to use express
const app = express()
// imports passport to use for user authentication, currently uses a local strategy
const passport = require('passport')
// imports express session which allows me to handle user authenticated sessions and store that data temporarily
const session = require('express-session')
// cookie parser helps me to use cookies that are set on the client and sent to the server, I am using this to transmit location data for where a post is based off of.
const cookieParser = require('cookie-parser')
// imports connect-mongo as MongoStore, this package is used to facilitate storing of user session data on mongodb while they are logged in
// so if they leave the page and come back without logging out they will still be logged in if that session is still valid
const MongoStore = require('connect-mongo')
// references my configuration folder for my database setup, running this imported function will connect my app to mongoDB
const connectDb = require('./config/database')
// imports our routes for handling login and user registration, necessary to reference from the main app
const loginRoutes = require('./routes/loginRoute')
// imports our routes for handling the main home page and displaying threads there, necessary to reference from the main app
const homeRoutes = require('./routes/homeRoute')
// imports our routes for handling messages/comments on individual posts
// *this one needs to be made a subroute of home
const messageRoutes = require('./routes/messageRoute')
// references my configuration folder for my cloudinary setup, running this imported function will connect my app to cloudinary, much the same as my mongoDB setup
const cloudConfig  = require('./config/cloudinaryconfig')

// usingt the dotenv package allows node/express to grab information from the config folder, the path is passed relative to this file
require('dotenv').config({ path:'./config/.env' })

// these two lines setup mongoDB and Cloudinary respectively, running them here ensures they are accessible elsewhere in the server
connectDb()
cloudConfig()

// this sets our port variable to either the environments port or a default of 7000 if environment is unavailable
const PORT = process.env.PORT || 7000

// this line imports the login check function from our passport middleware.
// running this function here instructs passport as to what strategy to use for authentication
const { loginCheck } = require('./authMiddleware/passport')
// runs the above function passing the passport reference as the argument
loginCheck(passport)

// tells express to use EJS our view engine, when using render on a file it will render using the EJS templating engine
app.set('view engine', 'ejs')

// tells express that the public folder is accessible to serve static files, such as my client side js files,style sheets, images,logos, plain html pages, etc.
// items in this folder are accessible without the use of a route and can be accessed by any request so they are public
app.use(express.static('public'))
// this sets express to handle incoming requests using the 'qs' library which supports nested objects but does not filter out the '?' from the url, as opposed to the 'query-string' library which does not support nested objects but does filter out the ? mark
app.use(express.urlencoded({ extended: true }))
// express.json is based on body parser and tells the express app to parse incoming request bodys and output them as JSON formatted data
app.use(express.json())
// tells the express app to look for cookies using the cookie parser middleware package imported earlier
app.use(cookieParser())
// this sets up our session configuration for keeping users logged in after authentication
app.use(session({
  // sets a secret for encryption from our env file
  secret: process.env.SECRET,
  // tells the app to not save uninitialized session data in the session store (mongoDB for my use case)
  saveUninitialized: false,
  // since this is false a created and stored session will not be re-updated if it is brought back into activity by a user who left and then returned.
  // setting it to true will reset the sessions  expiration if it is made active again
  resave: false,
  // this tells express session to use the designated mongodb collection to store session data. connect-mongo is used for handling the interaction between mongoDB and express-session
  store:MongoStore.create({ mongoUrl:process.env.DB_STRING }),
}))

// tells passport to start up, passport can use the user token in the cookie to ensure authorized access, start the authentication module
app.use(passport.initialize())
// tells passport to use the session middleware that modifies the user cookie token on the request object
app.use(passport.session())

// *sets the static folder for each of the specified routes, probably unnecessary or bad practice in this format
app.use('/home',express.static('public'))
app.use('/messages',express.static('public'))
// tells express to use '/' as the main route and reference the loginRoutes for this url path
app.use('/', loginRoutes)
// tells express to reference the homeRouter for any url paths starting with /home
app.use('/home', homeRoutes)
// tells express to reference the messageRouter for any url paths starting with /messages
// *this probably needs to merge to a subroute of homeroutes if possible
app.use('/messages', messageRoutes)
// tells the app to listen to the port
app.listen(PORT, console.log('server is up'))