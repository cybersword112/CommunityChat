const express = require('express')
const app = express()
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const connectDb = require('./config/database')
const loginRoutes = require('./routes/loginRoute')
const homeRoutes = require('./routes/homeRoute')
const dashboardRoutes = require('./routes/dashboardRoute')
const messageRoutes = require('./routes/messageRoute')
const cloudConfig  = require('./config/cloudinaryconfig')
require('dotenv').config({ path:'./config/.env' })

connectDb()
cloudConfig()

const PORT = process.env.PORT || 7000
const { loginCheck } = require('./authMiddleware/passport')
loginCheck(passport)

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  store:MongoStore.create({ mongoUrl:process.env.DB_STRING }),
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/home',express.static('public'))
app.use('/messages',express.static('public'))

app.use('/', loginRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/home', homeRoutes)
app.use('/messages', messageRoutes)

app.listen(PORT, console.log('server is up'))