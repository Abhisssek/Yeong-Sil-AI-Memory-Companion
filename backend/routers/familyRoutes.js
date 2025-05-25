const express = require("express");
const {
  addFamilyMember,
  getFamilyMembers,
} = require("../controller/familyController");
const isAuth = require("../middleware/authMiddleware");

const router = express.Router();

// ➕ Add a new family member to a specific user
router.post("/add-member",isAuth, addFamilyMember);

// 📄 Get all family members for a specific user
router.get("/get-member", getFamilyMembers);


module.exports = router;
