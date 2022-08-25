// imports mongoose to use  for our interaction with mongoDB, allows use of schema/models that ensure data going to db is uniform
const mongoose = require('mongoose')
// function for connecting to our mongoDB collection to ensure accesibility by our models and controllers
async function connectDB(){
  // try/catch syntax for handling any errors that arrise from our db connection attempt
  try{
    // defines async mongoose connection to our db url, and provides configuration arguments for the connection
    const con = await mongoose.connect(process.env.DB_STRING,{
      // since mongoDB has depricated the old string parser this connection option is provided to allow us to fall back to the old driver if issues arrise from the new one.
      useNewUrlParser:true,
      // enables the new connection engine, this is by default false but should be set to true unless a connection issue prevents proper functionality.
      useUnifiedTopology:true,
    })
    // console logs our connection host
    console.log('DB connected: ' +con.connection.host)
// the catch portion of our try catch syntax, this is triggured if any promise errors arrise
  }catch(err){
    console.error(err)
    // throws an uncaught fatal exception flag
    process.exit(1)
  }
}
// exports the connection function to be used in the main server file upon startup
module.exports = connectDB