const express = require("express");
const router = express.Router();
const wrapAsync = require("../middleware/wrapasync.js");
const {validateListing} = require("../validations/validation.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const {listingOwner} = require("../middleware/isOwner.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


router.get ("/new", isLoggedIn, listingController.renderNew); // route to render new listing form

router.route("/")
    .get(wrapAsync(listingController.index))  // route to index page
    .post(isLoggedIn, upload.single('listing[image]'), validateListing , wrapAsync(listingController.new)); // route to save new listing

router.route("/:id")
    .get(wrapAsync(listingController.view)) // route to view each listing
    .put(isLoggedIn, listingOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.edit)); // route to edit a listing



router.get("/:id/edit", isLoggedIn, listingOwner, wrapAsync(listingController.renderEdit)); // route to render edit page

router.delete("/:id", isLoggedIn, listingOwner, wrapAsync(listingController.delete));  // delete routes


module.exports = router;