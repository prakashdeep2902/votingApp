const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema({
  AdminName: {
    type: String,
    required: true, // Corrected `require` to `required`
  },
  AdminPhoneNo: {
    type: String, // Changed to String to handle leading zeros and long numbers
    required: true, // Corrected `require` to `required`
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Validates that it has exactly 10 digits
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
  AdminEmail: {
    type: String,
    required: true,

    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email`, // Corrected validation message for clarity
    },
  },
  AdminAadharId: {
    type: String,
    required: true,
  },
  AdminPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Admin",
  },
});

AdminSchema.pre("save", async function (next) {
  try {
    if (this.isModified("AdminPassword")) {
      const salt = await bcrypt.genSalt(10);
      const hasPass = bcrypt.hashSync(this.AdminPassword, salt);
      this.AdminPassword = hasPass;
    }

    next();
  } catch (error) {
    return next(error);
  }
});

AdminSchema.pre("save", async function (next) {
  try {
    const existingDoc = await mongoose.model("Admin").findOne();
    if (existingDoc) {
      const error = new Error("only One admin allow to save into db");

      return next(error);
    }

    next();
  } catch (error) {
    return next(error);
  }
});
module.exports = mongoose.model("Admin", AdminSchema);
