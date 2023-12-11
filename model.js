const mongoose = require("mongoose");

const YourSchema = new mongoose.Schema({
    // Define your schema fields here
    _id: String,
    totalEarnedReward: Number,
    username: String,
  });

  module.exports = YourSchema;