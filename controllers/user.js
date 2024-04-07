const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signup = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User ({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=> {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wonderlust");
            res.redirect("/listings");
        })   
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
};

module.exports.renderLogin =  (req, res) => {
    if(!req.session.redirectURL){
        req.session.redirectURL = req.headers.referer;
    };
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success","welcome back to wonderlust !");
    res.redirect(res.locals.redirectURL || "/listings");
};

module.exports.logout = (req, res) => {
    req.logout((err)=> {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out sucessfuly");
        res.redirect("/listings");
    })
};