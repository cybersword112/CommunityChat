//js

const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const passport = require('passport')


//For Register Page
const registerView = (req, res) => {
  res.render('signup', {} )
}

//Post Request that handles Register
const registerUser = (req, res) => {
  const { name, email, location, password, confirm } = req.body
  if (!name || !email || !password || !confirm) {
    console.log('Fill empty fields')
  }
  //Confirm Passwords
  if (password !== confirm) {
    console.log('Password must match')
  } else {
    //Validation
    User.findOne({ email: email }).then((user) => {
      if (user) {
        console.log('email exists')
        res.render('signup', {
          name,
          email,
          password,
          confirm,
        })
      } else {
        //Validation
        const newUser = new User({
          name,
          email,
          location,
          password,
        })
        //Password Hashing
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser
              .save()
              .then(res.redirect('/login'))
              .catch((err) => console.log(err))
          })
        )
      }
    })
  }
}

// For View
const loginView = (req, res) => {
  res.render('signin', {} )
}

const loginUser = (req,res) => {
  const { email,password } = req.body
  //required
  if(!email || !password){
    console.log('Please fill in all the fields')
    res.render('signup',{
      email,
      password,
    })
  } else {
    passport.authenticate('local', {
      successRedirect:'/home',
      failureRedirect:'/login',
      failureFlash:true,
    })(req,res)
  }
}

const logoutUser = (req,res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  })
}

module.exports =  {
  registerView,
  loginView,
  registerUser,
  loginUser,
  logoutUser,
}