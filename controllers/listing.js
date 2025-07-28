const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

if (!mapToken) {
    console.error("Mapbox Token is missing! Check your environment variables.");
}

const geocodingClient = mbxGeocoding({ accessToken: mapToken });


//   module.exports.index = async (req, res) => {
//     //const { category } = req.query;
//     console.log("✅ Category from query:", category); // check what we are receiving

//     let listings;

//     if (category) {
//         listings = await Listing.find({ category: { $regex: `^${category}$`, $options: "i" } });
//         console.log("✅ Listings found for category:", listings.length);
//     } else {
//         listings = await Listing.find({});
//         console.log("✅ All Listings found:", listings.length);
//     }

//     res.render("listings/index", { listings, category });
// };

  module.exports.index = async (req, res) => {
    const { category } = req.query; // ✅ this must be present

    console.log("✅ Category from query:", category); // Just for debugging

    let listings;

    if (category) {
        listings = await Listing.find({ category: { $regex: `^${category}$`, $options: "i" } });
        console.log("✅ Listings found for category:", listings.length);
    } else {
        listings = await Listing.find({});
        console.log("✅ All Listings found:", listings.length);
    }

    res.render("listings/index", { listings, category });
};



module.exports.renderNewform = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author", select: "username email" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.CreateListing = async (req, res, next) => {
    try {
        console.log("Received request to create listing:", req.body);
        console.log("Current User:", req.user);
        console.log("Using Mapbox Token:", mapToken);

        if (!req.body.listing || !req.body.listing.location) {
            console.log("Error: Location is missing!");
            req.flash("error", "Location is required!");
            return res.redirect("/listings/new");
        }

        console.log("Geocoding location:", req.body.listing.location);

        let response = await geocodingClient
            .forwardGeocode({ query: req.body.listing.location, limit: 1 })
            .send();

        console.log("Full Geocoding Response:", JSON.stringify(response.body, null, 2));

        if (!response.body.features.length) {
            console.log("Error: No features returned from geocoding.");
            req.flash("error", "Invalid location!");
            return res.redirect("/listings/new");
        }

        console.log("Geocoding response:", response.body.features[0].geometry);

        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.geometry = response.body.features[0].geometry;

        if (req.file) {
            newListing.image = { url: req.file.path, filename: req.file.filename };
        }

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        req.flash("error", "Failed to create listing.");
        return res.redirect("/listings/new");
    }
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id).populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (!listing.owner._id.equals(req.user._id)) {
            req.flash("error", "Unauthorized to edit this listing");
            return res.redirect(`/listings/${id}`);
        }

        let originalImageUrl = listing.image ? listing.image.url.replace("/upload", "/upload/w_250") : "";
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        listing.set(req.body.listing);

        if (req.file) {
            listing.image = { url: req.file.path, filename: req.file.filename };
        }

        await listing.save();
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        req.flash("error", "Something went wrong.");
        res.redirect("/listings");
    }
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (!listing.owner._id.equals(req.user._id)) {
            req.flash("error", "Unauthorized to delete this listing");
            return res.redirect(`/listings/${id}`);
        }

        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted successfully");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
};
