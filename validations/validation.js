const {listingSchema, reviewSchema} = require("./validationSchema.js");
const ExpressError = require("../middleware/expressError.js")

module.exports.validateListing = (req, res, next)=> {
    const {error} = listingSchema.validate(req.body);
    if(error){
        return next(new ExpressError(404, error.message));
    }else{
        next();
    }
}


module.exports.validateReview = (req, res, next)=> {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        return next(new ExpressError(404, error.message));
    }else{
        next();
    }
}