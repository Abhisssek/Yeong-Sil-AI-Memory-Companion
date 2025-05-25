const mongoose = require("mongoose");
const healthSchema = require("./healthSchema");

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  mobile: {
    countryCode: { type: String, required: true }, // e.g., "+91"
    number: { type: String, required: true },      // e.g., "9876543210"
  },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  familyMembers: { type: [familyMemberSchema], default: [] },
  health: healthSchema,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
