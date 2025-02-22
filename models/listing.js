const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "No description available.",
  },
  image: {
    url:String,
    filename:String,
  },
  
  price: {
    type: Number,
    required: true,
    min: 0, // ✅ Ensures no negative prices
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
   
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    },
  },
  category:{
    type:String,
    enum:["mountains","arctic","farms","deserts"]  
},
});

// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
