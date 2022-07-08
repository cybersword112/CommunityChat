require ('newrelic');

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDb = require('./config/database')

require('dotenv').config( { path:'./config/.env' })

connectDb()

const { loginCheck } = require('./authMiddleware/passport')
loginCheck(passport)


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  store:MongoStore.create({mongoUrl:process.env.DB_STRING})
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