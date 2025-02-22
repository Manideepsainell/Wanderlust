const Listing = require("../models/listing");
const Review = require("../models/review"); // Ensure the correct import

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    
    if (!listing) { 
        return res.status(404).json({ error: "Listing not found" }); 
    }

    if (!req.user) {  
        return res.status(401).json({ error: "You must be logged in to leave a review" });
    }

    let newReview = new Review(req.body.review); // Corrected `Review` reference
    newReview.author = req.user._id; 

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId); // Corrected `Review` reference
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};
