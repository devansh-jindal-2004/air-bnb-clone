module.exports = (req, res, next) => {
    if(req.session.redirectURL){
        res.locals.redirectURL = req.session.redirectURL;
        delete req.session.redirectURL;
    }
    next();
}