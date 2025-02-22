const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Reviews=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController= require("../controllers/reviews.js");

//Reviews route
//post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
      .populate({
          path: "reviews",
          populate: {
              path: "author", // Populate the author field in reviews
              select: "username", // Select only the username from User model
              model: "User"  // Ensure this matches your User model name
          }
      })
      .populate("owner"); // Also populate owner details

  if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
  }

  console.log(listing);
  res.render("listings/show.ejs", { listing });
}));


  
  // Delete Review Route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;
