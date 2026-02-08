const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const router = express.Router();
const userController = require("../controlllers/users.js");

router
  .route("/signUp")
  //goes to singUp form
  .get(async (req, res) => {
    res.render("../users/signUp.ejs");
  })
  //signs up the user and goes to index page
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  //goes to login form
  .get(userController.loginForm)
  //logs in the user
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

//logs out the user
router.get("/logout", userController.logOut);

module.exports = router;
