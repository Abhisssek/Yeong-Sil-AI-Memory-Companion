const express = require("express");
const router = express.Router();
const {
  addDoseSchedule,
  createHealthInfo,
  getHealthInfo,
  updateHealthInfo,
  getDoseInfo,
  changeDoseSchedule,
  deleteDoseSchedule,
} = require("../controller/healthController");

const authMiddleware = require("../middleware/authMiddleware"); // ensure user is authenticated

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create health info
router.post("/add-health", createHealthInfo);

// Get health info
router.get("/all-health", getHealthInfo);

// Update health info
router.put("/update-health", updateHealthInfo);

// Add a new dose schedule
router.post("/add-dose", addDoseSchedule);

// Get all dose schedules
router.get("/dose", getDoseInfo);

// Update a dose schedule
router.put("/dose-update/:scheduleId", changeDoseSchedule);

// Delete a dose schedule
router.delete("/dose/delete", deleteDoseSchedule);

module.exports = router;
