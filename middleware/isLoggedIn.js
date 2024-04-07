module.exports = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "you must be logged in before performing this action");
        return res.redirect("/login");
    }
    return next();
}