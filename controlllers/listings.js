const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  let allListing = await Listing.find();
  res.render("index.ejs", { allListing });
};

module.exports.newForm = (req, res) => {
  res.render("addListing.ejs");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you requested for does not exist");
    return res.redirect("/listing");
  } else {
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("edit.ejs", { listing, originalImageUrl });
  }
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing you requested for does not exist");
    return res.redirect("/listing");
  } else {
    res.render("show.ejs", { listing });
  }
};

module.exports.newListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = new Listing(req.body.listing);
  listing.owner = req.user.id;
  listing.image = { url, filename };
  await listing.save();
  req.flash("success", "New listing added");
  res.redirect("/listing");
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedListing = req.body.listing;
  if (!updatedListing)
    throw new ExpressError(400, "Enter valid data for listing");
  let listing = await Listing.findByIdAndUpdate(id, updatedListing);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listing updated successfully");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing deleted");
  res.redirect("/listing");
};
