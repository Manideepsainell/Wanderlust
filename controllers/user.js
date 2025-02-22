const User=require("../models/user");
module.exports.renderSignupform= (req, res) => {
    res.render("users/signup.ejs");
  };

module.exports.signup=async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (err) => {
        if (err) return next(err);

        // Fallback to "/listings" if redirect URL is missing
        const redirectUrl = req.session.redirectUrl || "/listings"; 
        delete req.session.redirectUrl; // Clear session redirect

        req.flash("success", "Welcome to Wanderlust!");
        res.redirect(redirectUrl);
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust");

  // Correct the order of redirects
  let redirectUrl = req.session.returnTo || req.session.redirectUrl || "/listings";
  
  console.log("🚀 Corrected Final Redirect URL after login:", redirectUrl);
  
  // Clear session variables to prevent looping
  delete req.session.returnTo;
  delete req.session.redirectUrl;

  res.redirect(redirectUrl);
};





module.exports.logout= async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    });
  }