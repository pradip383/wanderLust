const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review.js");
const User=require("./user.js");


const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/01/13/13/21/paradise-598201_1280.jpg",
    },
  },
  price: {
    type: Number,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  await Review.deleteMany({ _id: { $in: listing.reviews } });
});

const listing = mongoose.model("Listing", listingSchema);

module.exports = listing;
