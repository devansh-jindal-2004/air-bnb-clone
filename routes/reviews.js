const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../middleware/wrapasync");
const {validateReview} = require("../validations/validation.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const {reviewOwner} = require("../middleware/isOwner.js")
const reviewController = require("../controllers/reviews.js")


router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview)); //route to save new review

router.delete("/:reviewid", isLoggedIn, reviewOwner, wrapAsync(reviewController.deleteReview)); // route to destroy a review


// redirect route

router.all("*", (req, res) => {
    res.redirect(`/listings/${req.params.id}`);
})

module.exports = router;