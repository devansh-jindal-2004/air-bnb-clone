module.exports = (req, res, next) => {
    if(res.locals.currentUser){
        return res.redirect("/listings")
    }
    next()
}