const express = require("express");
const Admin = require("../Models/AdminSchema.js");
const bcrypt = require("bcrypt");
const router = express.Router();
const { genrateToken } = require("../utils/jwt.js");

router.post("/Signup", async (req, res) => {
  try {
    const { name, PhoneNo, Email, AadharId, password } = req.body;

    const adminUser = new Admin({
      AdminName: name,
      AdminPhoneNo: PhoneNo,
      AdminEmail: Email,
      AdminAadharId: AadharId,
      AdminPassword: password,
    });

    const Adminres = await adminUser.save();

    res.status(201).json({
      message: "Admin has been created successfully",
      data: Adminres,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res.status(400).json({
        message: "Validation Error",
        errors: error.errors,
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
});

// For login Admin
router.post("/login", async (req, res) => {
  try {
    const { aadharId, password } = req.body;

    const admin = await Admin.findOne({ AdminAadharId: aadharId });

    if (!admin) {
      return res.status(400).json({ message: "Admin is not found in db" });
    }

    const isMatchAddahar = await bcrypt.compare(password, admin.AdminPassword);

    if (!isMatchAddahar) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = genrateToken({
      id: admin._id,
      role: admin.role,
    });

    res.status(200).json({ msg: "Login successful", data: admin, token });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
