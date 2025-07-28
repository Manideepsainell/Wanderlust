const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, saveRedirectUrl } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// HOME + CREATE
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("image"), wrapAsync(listingController.CreateListing));

// NEW LISTING FORM
router.get("/new", isLoggedIn, saveRedirectUrl, listingController.renderNewform);

// SHOW, UPDATE, DELETE
router
    .route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(isLoggedIn, isOwner, upload.single("image"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// EDIT FORM
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
