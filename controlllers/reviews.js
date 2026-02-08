const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.newReview = async (req, res) => {
  let { id } = req.params;
  let review = new Review(req.body.review);
  let listing = await Listing.findById(id);
  review.author = req.user._id;
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  req.flash("success", "review saved");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete({ _id: reviewId });
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "review deleted");
  res.redirect(`/listing/${id}`);
};
