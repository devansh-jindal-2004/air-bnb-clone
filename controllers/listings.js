const Listing = require("../models/listing.js");


// controller for index route

module.exports.index = async(req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};


// controller for rendering new page form 

module.exports.renderNew =  (req, res, next) => {
    res.render("listings/new.ejs");
};


// controller to create a new listing

module.exports.new = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url, filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "new Listing created");
    res.redirect("/listings");
};


// controller for view listing page 

module.exports.view = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).populate("owner").populate({
        path: "reviews",
        populate: {
            path: "author",
            model: "User",
            select: "username" 
        }
    });
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("listings/view.ejs", { listing });
};


// controller to render listing edit page

module.exports.renderEdit = async(req, res, next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }
    let originalURL = listing.image.url;
    originalURL = originalURL.replace("/upload", "/upload/w_200");
    res.render("listings/edit.ejs", {listing, originalURL});
};


// controller to update listing

module.exports.edit = async (req, res, next) => {
    const id = req.params.id;
    const updatedListingData = { ...req.body.listing };
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename; 
        updatedListingData.image = {url, filename}; 
    }
    await Listing.findByIdAndUpdate(id, updatedListingData, { new: true });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};


// controller to delete listing 

module.exports.delete = async(req, res, next) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted");
    res.redirect(`/listings`);
};