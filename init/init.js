const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main().then(() => {
  console.log("connection  succesfull");
});

const intitDb = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"69629d173984b1e6d7a11294"}));
  await Listing.insertMany(initData.data);
  console.log("DAta saved");
};

intitDb();