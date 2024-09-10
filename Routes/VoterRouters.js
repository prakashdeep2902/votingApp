const router = require("express").Router();
const Voter = require("../Models/VoterSchema.js");
const { genrateToken } = require("../utils/jwt.js");
router.post("/signup", async (req, res) => {
  try {
    const VoterData = req.body;

    // Validate required fields before proceeding
    if (!VoterData.name || !VoterData.aadharId || !VoterData.age) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const voterObjData = new Voter({
      VoterName: VoterData.name,
      VoterAadharId: VoterData.aadharId,
      voterAge: VoterData.age,
    });

    const VoterCreatedRes = await voterObjData.save();

    res.status(200).json({
      msg: "Voter created successfully",
      VoterData: VoterCreatedRes,
    });
  } catch (error) {
    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    // Handle duplicate entry errors for unique fields
    if (error.code === 11000) {
      return res.status(409).json({
        msg: "Duplicate entry, Voter Aadhar ID already exists",
      });
    }

    // Catch-all for other errors
    res.status(500).json({ error: "Internal server error", details: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { aadharId } = req.body;
    if (!aadharId) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const LoginData = await Voter.findOne({ VoterAadharId: aadharId });

    if (!LoginData) {
      return res.status(400).json({ msg: "voter not Find please signup" });
    }
    const voterToken = genrateToken({
      id: LoginData._id,
      role: LoginData.role,
    });

    res
      .status(200)
      .json({ msg: "user able to find", data: LoginData, token: voterToken });
  } catch (error) {
    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    // Catch-all for other errors
    res.status(500).json({ error: "Internal server error", details: error });
  }
});

module.exports = router;
