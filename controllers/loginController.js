const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const passport = require('passport')


module.exports = {
  //For Register Page
  registerView : (req, res) => {
    res.render('signup', {} )
  },

  //Post Request that handles Register
  registerUser : (req, res) => {
    const { username, password, confirm } = req.body
    if (!username || !password || !confirm) {
      console.log('Fill empty fields')
    }
    //Confirm Passwords
    if (password !== confirm) {
      console.log('Password must match')
    } else {
      //Validation
      User.findOne({ username: username }).then((user) => {
        if (user) {
          console.log('email exists')
          res.render('signup', {
            username,
            password,
            confirm,
          })
        } else {
          //Validation
          const newUser = new User({
            username,
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
  },

  // For View
  loginView : (req, res) => {
    res.render('signin', {} )
  },

  loginUser : (req,res) => {
    const { username,password } = req.body
    //required
    if(!username || !password){
      console.log('Please fill in all the fields')
      res.render('signup',{
        username,
        password,
      })
    } else {
      passport.authenticate('local', {
        successRedirect:'/home',
        failureRedirect:'/login',
        // failureFlash:true,
      })(req,res)
    }
  },

  logoutUser : (req,res) => {
    req.logout(function(err) {
      if (err) { return next (err) }
      req.user
      res.redirect('/login')
    })
  },

}
