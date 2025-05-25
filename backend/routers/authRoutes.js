const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controller/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser); // Optional
// sample endpoint for nothing
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Test endpoint is working!" });
});

module.exports = router;
