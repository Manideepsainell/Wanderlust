const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({}); // Clear existing data

  // Map the `owner` field before inserting
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67a98a8092aae57ea80923e7", // Set your desired owner ID
  }));

  // Insert data with the `owner` field
  let result = await Listing.insertMany(initData.data);

  console.log(result); // Log inserted data
  console.log("data was initialized");
};

initDB();
