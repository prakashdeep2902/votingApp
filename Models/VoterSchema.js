const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const VoterSchema = new mongoose.Schema({
  VoterName: {
    type: String,
    required: true,
  },
  VoterAadharId: {
    type: String,
    required: true,
    maxlength: 12, // corrected from `max` to `maxlength`
    unique: true,
  },
  voterAge: {
    type: Number,
    required: true,
    min: [18, "Voter age should be at least 18"],
  },
  role: {
    type: String, // Added type
    default: "voter", // Set default role value
  },
  isVoted: {
    type: String,
    default: false,
  },
});

module.exports = mongoose.model("Voter", VoterSchema);
