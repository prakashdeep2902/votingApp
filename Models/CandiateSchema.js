const mongoose = require("mongoose");

const candSchema = new mongoose.Schema({
  candname: {
    type: String,
    required: true,
  },
  candparty: {
    type: String,
    required: true,
  },
  candAge: {
    type: Number,
    required: true,
    min: [25, "At least age should be 25 to become a candidate"],
  },

  // Track votes as an array of voter references and vote timestamps
  votes: [
    {
      voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VoterSchema", // Reference to Voter model
      },
      VotedAt: {
        type: Date,
        default: Date.now, // Use Date.now to ensure it's assigned on creation
      },
    },
  ],

  voteCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Candidate", candSchema);
