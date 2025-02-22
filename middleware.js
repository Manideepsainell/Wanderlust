const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("./schema.js")
module.exports.isLoggedIn = (req, res, next) => {
  console.log("Checking if user is logged in:", req.isAuthenticated());
  
  if (!req.isAuthenticated()) {
    console.log("Saving redirect URL:", req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    console.log("Session after setting redirectUrl:", req.session);
    req.flash("error", "You must be logged in to create a listing.");
    
    console.log("Redirecting to /login");  // ADD THIS TO DEBUG
    return res.redirect("/login");
  }

  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (!req.session.returnTo && req.originalUrl !== "/login") {
      req.session.returnTo = req.originalUrl;
      console.log("🔹 Correctly setting returnTo:", req.session.returnTo);
  }
  next();
};







module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing = await Listing.findById(id).populate("owner");  // Ensure owner is populated
  console.log("Listing:", listing);  // Log the listing
  console.log("Listing Owner:", listing?.owner);  // Log the owner

  // Check if the logged-in user is the owner
  if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
     
      
  }
  next();
};
module.exports.validateListing=(req,res,next)=>{
  let {error}= listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
};

module.exports.validateReview=(req,res,next)=>{
  let{error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }

};
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  
  // Populate the `author` field to get the full user object
  let review = await Review.findById(reviewId).populate("author");
  
  if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/listings/${id}`);
  }

  // Check if the logged-in user is the author
  if (!review.author._id.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
  }
  
  next();
};
