const express = require('express')

const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 7000
const session = require('express-session')
const passport = require('passport')
const { loginCheck } = require('./auth/passport')
loginCheck(passport)

// eslint-disable-next-line no-undef
const dataBase = process.env.DB_STRING

mongoose
  .connect(dataBase, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true
  })
  .then(() => console.log('connected to db via mongoose'))
  .catch(err => console.log(err))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: true,
  resave: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/home',express.static('public'))
app.use('/messages',express.static('public'))


app.use('/', require('./routes/loginRoute'))
app.use('/dashboard', require('./routes/dashboardRoute'))
app.use('/home', require('./routes/homeRoute'))
app.use('/messages', require('./routes/messageRoute'))
app.listen(PORT, console.log('server is up'))