const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/listing.js");

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "welcome to wanderlust");
      res.redirect("/listing");
    });
  } catch (err) {
    req.flash("error", "user already registered");
    res.redirect("/user/signUP");
  }
};

module.exports.loginForm = async (req, res) => {
  res.render("../users/login.ejs");
};

module.exports.login = async (req, res) => {
  let redirectUrl = res.locals.redirectUrl || "/listing";
  req.flash("success", "welcome back to wanderLust");
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged out successfully");
    res.redirect("/listing");
  });
};
