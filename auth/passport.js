const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy

//load model

const User = require('../models/userModel')

const loginCheck = passport => {
  passport.use(
    new LocalStrategy({ usernameField:'email' },(email,password,done) => {
      //check customer/user
      User.findOne({ email:email })
        .then((user) => {
          if(!user){
            console.log('wrong email')
            return done()
          }

          //match password
          bcrypt.compare(password, user.password, (error, isMatch) => {
            if(error)throw error
            if(isMatch){
              return done(null,user)
            }else{
              console.log('wrong password')
              return done()
            }
          })
        })
        .catch((error) => console.log(error))
    })
  )

  passport.serializeUser((user,done) => {
    done(null,user.id)
  })
  passport.deserializeUser((id,done) => {
    User.findById(id,(error,user) => {
      done(error,user)
    })
  })
}

module.exports = {
  loginCheck,
}