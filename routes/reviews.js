const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn}=require("../middleware.js");
const {isReviewOwner}=require("../middleware.js");
const reviewController=require("../controlllers/reviews.js");


router.post(
  "/",
  validateReview,
  wrapAsync(reviewController.newReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(reviewController.destroyReview)
);

module.exports=router;