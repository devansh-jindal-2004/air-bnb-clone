const express = require("express");
const router = express.Router({mergeParams: true});
const wrapasync = require("../middleware/wrapAsync.js");
const passport = require("passport");
const saveRedirectURL = require("../middleware/saveRedirectURL.js");
const redirectHome = require("../middleware/redirectHome.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const userController = require("../controllers/user.js");


router.route("/signup")
.get(redirectHome, userController.renderSignup) // route to render signup page
.post(wrapasync(userController.signup));  // route to perform signup

router.route("/login")
.get(redirectHome, userController.renderLogin)  // route to render login page
.post(saveRedirectURL, passport.authenticate("local", { failureRedirect: `/login`, failureFlash: true }),wrapasync(userController.login));  // route to perform login

router.get("/logout", isLoggedIn, userController.logout);  // route to perform logout

module.exports = router;