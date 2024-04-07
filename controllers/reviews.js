const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    req.flash("success", "Review Added");
    res.redirect(`/listings/${listing._id}`)
};


module.exports.deleteReview = async(req, res, next) => {
    const {id, reviewid} = req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};