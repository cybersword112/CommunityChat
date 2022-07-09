//for register page
module.exports ={
  getDashboardView: (req,res) => {

    res.render('dashboard',{
      user:req.user
    })
  },

}
