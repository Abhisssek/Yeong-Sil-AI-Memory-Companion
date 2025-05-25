const mongoose = require("mongoose");



const doseScheduleSchema = new mongoose.Schema({
  medicine: { type: String, required: true },
  dosage: { type: String }, // e.g., "1 tablet"
  time: { type: String, required: true }, // "HH:mm" format
  notes: { type: String }
});

const healthSchema = new mongoose.Schema({
    height: { type: String }, // e.g., "5'8"
    weight: { type: String }, // e.g., "70 kg"
  bloodGroup: { type: String },
  diseases: [{ type: String }],
  allergies: [{ type: String }],
  medications: [{ type: String }],
  notes: { type: String },
  doseSchedule: [doseScheduleSchema], // ✅ New field
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = healthSchema;
