function mainView(req, res){
    res.render('main',{
        user:req.user,
    })
}

module.exports = {
    mainView
}