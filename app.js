if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("Using Mongo URI:", process.env.MONGO_URI);

const MongoStore = require("connect-mongo");
const dbUrl = process.env.MONGO_URI;
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");

// Route files
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Check env variables
if (!dbUrl) {
  console.error("❌ Missing MONGO_URL in .env file!");
  process.exit(1);
}
if (!process.env.SECRET) {
  console.error("❌ Missing SECRET in .env file!");
  process.exit(1);
}

// Express app setup
const app = express();

// Mongo session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

// Connect to DB
async function main() {
  try {
    const connection = await mongoose.connect(dbUrl);
    console.log("✅ Connected to DB:", connection.connection.name);
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}
main();

// View engine & middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session config
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & current user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ✅ ROUTES
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);

// ✅ Redirect '/' to '/listings'
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ❌ Catch-all 404 route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

// ✅ Server
app.listen(8080, () => {
  console.log("✅ Server is listening on port 8080");
});
