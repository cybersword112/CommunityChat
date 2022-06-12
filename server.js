const express = require('express') // server software
const { response } = require('express')//defines response to use express
const { request } = require('express')//defines request to use express

//used for user validation of valid user name and password entry 
const { check, validationResult } = require('express-validator');//defines check and validation result of express-valdator
const session = require('express-session'); // express-sessions used for session auth, --session middleware
const { v4: uuidv4 } = require('uuid'); // uuid, To call: uuidv4()
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization

const User = require('./user.js'); // User Model 

const app = express() //express is now called app

const MongoClient = require('mongodb').MongoClient //for base mongoDB use

// const mongoose = require('mongoose');//for utilization of mongoose to make mongoDB work easier
// const passportLocalMongoose = require('passport-local-mongoose'); //passport verification with mongoose via local credentials

//tells express to use ejs when rendering template files
app.set('view engine', 'ejs')

// allows exprss to access files in public folder without request
app.use(express.static('public'))

// allows express to process body of requests
app.use(express.urlencoded({ extended: true }))

// allows express to make request bodies into json format
app.use(express.json())// parser middleware

app.use(passport.initialize());//Middleware to use Passport with Express
app.use(passport.session()); //Needed to use express-session with passport
passport.use(User.createStrategy()) // Passport Local Strategy

// Configure Sessions Middleware for use 
app.use(session({
    genid: function (req) {
        // returns random ID
      return uuidv4();
    },
    // secret string signs cookies
    secret: secretS,
    // reduces call volume only saves if session data has changed
    resave: false,
    // new uninitialized sessions get forcibly saved.
    saveUninitialized: true,
    // set parameters for cookie usage, yum
    cookie: {maxAge:60*60*1000,secure: true}
  }));

// enable this option if using a proxy
// app.set('trust proxy',1)

const PORT = 2121 //local host connection Port
require('dotenv').config() //loads .env file contents into process.env accessible

// const Schema = mongoose.Schema; //tells code to reference mongoose for schema defn

// secret string useed for signing cookies that hold the session ID
const secretS = process.env.SECRET

// sets MongoDB connection variables and retrieves unique url from environment file
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'CommunityChat'
// connects to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// defines User object and types for use with mongoDB/mongoose
// const User = new Schema({
//     username: String,
//     password: String
// })


//currently does same function as above 
// mongoose.connect(dbConnectionStr,{
//     // This is set to avoid deprecation warnings from the native MongoDB driver; it’s opt-in to 
//     // facilitate conversions for older applications. Set this to true for new development
//     useNewUrlParser: true,
//     // Also set to avoid deprecation warnings; briefly, 
//     // the connection management engine was upgraded. Set to true for new development
//     useUnifiedTopology: true
// })

// array that user logins are passed to in order to check validity
const loginValidation = [
    check('userName', "User name should be creative!")
    .notEmpty().isLength({max: 30, min:3}).withMessage("User name must be between 3 and 30 characters long.").trim().escape(),
    check('password')
    .notEmpty().isLength({min:8,max:30}).withMessage('Passwords must be betweeen 8 and 30 characters long.').trim().escape()
]

// Home Page Route
// app.get('/', (req, res) => {
//     res.send(req.sessionID);
//   });

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// default site first page, user login
app.get('/',(request,response)=>{
    response.sendFile(__dirname + '/public/static/login.html')
})

//*main page, after login, displays all forum threads
// *this and other requests should be re-written using Asyns and await + try and catch
app.get('/main',(request, response)=>{
    db.collection('threads').find().toArray()
    .then(data => {
        console.log(request.session.username)
        response.render('index.ejs', { threads: data, user: request.session.username})
    })
    .catch(error => console.error(error))
})


//*handles a user adding a like to posted thread
app.put('/addOneLike', (request, response) => {
    db.collection('threads').updateOne({threadName: request.body.threadNameS, threadPrompt: request.body.promptS,likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
        }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))
    
})

//*adds a new user from the static login screen new user form
// validates user name and password forms using loginValidation array defined at start of program
app.post('/users/addUser', loginValidation, (request, response) => {

    // uses express-validator to check results of user request
    const errors = validationResult(request)
    
    // if there are errors in the array returned from checking submission it returns a json holding array of errors
    if( !errors.isEmpty()){
        console.log('user add failed')
        return response.status(422).json({errors:errors.array()})
    }
    // executes new user login code if no errors
    else{
        // inserts new user to users collection in MongoDB
        db.collection('users').insertOne({userName: request.body.userName,
        password: request.body.password})
        .then(result => {
            // after user added sends user via a redirect to the main page to view threads
            request.session.username = request.body.userName;
            console.log('user Added')
            response.redirect(`/main`)
        })
        // logs any errors occured when working with database insert
        .catch(error => console.error(error))
    }
})

//*handles user request to add a new thread to forum
app.post('/addThread', (request, response) => {
    // *default messages inserted to thread for testing. should be empty array
    let message = [{message:'hey',likes:0},{message:'hi',likes:0}]
    // builds and inserts new thread to collection 
    db.collection('threads').insertOne({threadName: request.body.threadName,
    threadPrompt: request.body.threadPrompt, likes: 0, messages:message})
    // after thread added, reloads page to display new thread
    .then(result => {
        console.log('Thread Added')
        response.redirect('/main')
    })
    // logs any errors occured when working with database insert
    .catch(error => console.error(error))
})

//*deletes thread from database, 
// *this should be edited to only hide not delete as eventually all should be archived for reference
app.delete('/deleteThread', (request, response) => {
    db.collection('threads').deleteOne({threadName: request.body.threadNameS})
    .then(result => {
        console.log('Thread Deleted')
        response.json('Thread Deleted')
    })
    .catch(error => console.error(error))

})

//*handles request generated from user clicking on thread
// takes user to next page containing all messages in that thread.
app.get('/threads/getThread/:name',(request, response)=>{
    // finds corresponding thread document in mongo collection
    db.collection('threads').findOne({threadName:request.params.name})
    .then(object=>{
        console.log(object)
        // passes the thread document as an object into the thread.ejs template as "info"
        response.render('thread.ejs', { info: object })
    })
    .catch(error => console.error(error))
})

//*handles user submission of new message to thread by adding to the messages array in the thread document
app.post('/threads/addMessage', (request, response) => {
    console.log(request.body.userName)
    // finds correct thread and updates message array with new message 
    // *relies on user to self-identify user name currently
    db.collection('threads').findOneAndUpdate(
        {threadName: request.body.threadName},
        {$push:{"messages":{"userName": request.body.userName, "message": request.body.message}}}
    )
    // redirects user to same page with updated message list
    .then(result => {
        console.log(result)
        console.log(request.body.threadName)
        response.redirect(`/threads/getThread/${request.body.threadName}`)
    })
    .catch(error => console.error(error))
})


// opens server to listen to local or heroku port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
