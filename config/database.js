const mongoose = require('mongoose')

async function connectDB(){
  try{
    const con = await mongoose.connect(process.env.MONGO_STR,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
    })

    console.log('DB connected: ' +con.connection.host)

  }catch(err){
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB