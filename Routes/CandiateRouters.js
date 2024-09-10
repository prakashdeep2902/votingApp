const router = require("express").Router();
const { Auth } = require("../Middleware/Auth.js");
const Candidate = require("../Models/CandiateSchema.js");
const Voter = require("../Models/VoterSchema.js");
const Admin = require("../Models/AdminSchema.js");

function isAdmin(userType) {
  return userType === "Admin";
}

// Route for voting
router.post("/giveVote/:CndId", Auth, async (req, res) => {
  try {
    const candidateId = req.params.CndId;
    const userType = req.user.role;
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    if (!isAdmin(userType)) {
      // Find the voter in db
      const voterId = req.user.id;
      const VoterData = await Voter.findById(voterId);

      if (!VoterData) {
        return res
          .status(404)
          .json({ error: "Voter not found, please sign up" });
      }

      if (VoterData.isVoted === true) {
        return res
          .status(400)
          .json({ error: "You have already voted, can't vote multiple times" });
      }

      // Update voter's isVoted flag
      VoterData.isVoted = true;
      const newVoterDataAfterVote = await VoterData.save();

      // Increment candidate's voteCount and save voter to candidate's voter list
      candidate.voteCount++;
      candidate.votes.push({ voters: voterId }); // Assuming you have a 'voters' field in your schema

      const candidateAfterVote = await candidate.save();

      return res.status(200).json({
        msg: "Vote successfully given",
        data: newVoterDataAfterVote,
        candidateData: candidateAfterVote,
      });
    } else {
      return res
        .status(401)
        .json({ error: "You are an Admin, you can't vote" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
});

// Admin signup route to create a candidate
router.post("/signup", Auth, async (req, res) => {
  try {
    const userType = req.user.role;

    if (isAdmin(userType)) {
      const { name, party, age } = req.body;

      if (!name || !party) {
        return res.status(400).json({ msg: "Missing required fields" });
      }

      const candObj = new Candidate({
        candname: name,
        candparty: party,
        candAge: age,
      });

      const candObjRes = await candObj.save();
      res.status(200).json({
        msg: "Candidate created successfully",
        data: candObjRes,
      });
    } else {
      return res.status(401).json({
        msg: "You are not an Admin, unauthorized",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
});

router.get("/vote/count", async (req, res) => {
  try {
    const candidates = await Candidate.find();

    if (!candidates) {
      return res.status(404).json({ error: "candidate not found" });
    }

    const VoteGetByParty = candidates.map((can) => {
      return {
        party: can.candparty,
        votes: can.voteCount,
      };
    });
   res.status(200).json(VoteGetByParty);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
});

module.exports = router;
