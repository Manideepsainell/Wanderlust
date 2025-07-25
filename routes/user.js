const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js"); // Make sure the path is correct
const userController=require("../controllers/user.js")


// ✅ Root redirect
router.get("/", (req, res) => {
  res.redirect("/listings");
});

// (Your signup/login routes below...)


// Signup route
router.route("/signup")
      .get(userController.renderSignupform)
      .post(
            wrapAsync(userController.signup));



// Login route
router.route("/login")
    .get(userController.renderLoginForm )
    .post(
    saveRedirectUrl,
    passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
 userController.login
);


// Logout route
router.get("/logout",userController.logout);

module.exports = router;
