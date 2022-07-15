
module.exports= {
  singleFileUpload : async (req,res,next) => {
    try{
      const file = req.file
      next()
    }catch(err){
      console.log(err)
    }
  }
}