const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controlllers/listings.js");
const { storage } = require("../cloudinaryConfig.js");
const multer = require("multer");
const upload = multer({ storage });

router.get("/", wrapAsync(listingController.index));

router
  .route("/new")
  //goes to newListing form
  .get(isLoggedIn, listingController.newForm)
  //adds new listing
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.newListing),
  );

router
  .route("/:id")
  //goes to show listing
  .get(wrapAsync(listingController.showListing))
  //updates listing and goes to show listing
  .patch(isLoggedIn, isOwner,upload.single("listing[image]"), wrapAsync(listingController.updateListing))
  //destroys listing
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
//goes to edit listing form
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListing));

module.exports = router;
