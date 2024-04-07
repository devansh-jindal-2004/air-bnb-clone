const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.listingOwner = async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    if(!res.locals.currentUser._id.equals(listing.owner)){
        req.flash("error", "you are not authorised to perform this action");
        return res.redirect(req.headers.referer)
    }
    next();
}

module.exports.reviewOwner = async(req, res, next) => {
    let review = await Review.findById(req.params.reviewid);
    if(!res.locals.currentUser._id.equals(review.author)){
        console.log(res.locals.currentUser._id);
        console.log(review.author);
        req.flash("error", "you are not authorised to perform this action");
        return res.redirect(req.headers.referer)
    }
    next()
}