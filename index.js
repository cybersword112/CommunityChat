const express = require('express')
const app = express()
const PORT = process.env.PORT || 7000
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const session = require('express-session')
const passport = require('passport')
const { loginCheck } = require('./auth/passport')
loginCheck(passport);
const dataBase = process.env.DB_STRING

mongoose
.connect(dataBase,{useUnifiedTopology:true,useNewUrlParser:true})
.then(()=>console.log('connected to db via mongoose'))
.catch(err=>console.log(err))

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: false}));

app.use(session({
    secret:'oneboy',
    saveUninitialized: true,
    resave: true
  }));

app.use(passport.initialize())
app.use(passport.session())

app.use('/',require('./routes/login'))

app.listen(PORT, console.log("server is up"))