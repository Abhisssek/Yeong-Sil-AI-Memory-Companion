const User = require("../models/userSchema");
const Memory = require("../models/memorySchema");


const createHealthInfo = async (req, res) => {
  const  userId  = req.user._id;
  const {
    height,
    weight,
    bloodGroup,
    diseases,
    allergies,
    medications,
    notes,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create or update health info
    user.health = {
      height,
      weight,
      bloodGroup,
      diseases,
      allergies,
      medications,
      notes,
      lastUpdated: new Date(),
      doseSchedule: [], // initialize as empty array for now
    };

    await user.save();
    // Save health info to memory
   await Memory.create({
      content: `Health information for ${user.name}: Height: ${height}, Weight: ${weight}, Blood Group: ${bloodGroup}, Diseases: ${diseases}, Allergies: ${allergies}, Medications: ${medications}, Notes: ${notes}`,
    });

    res.status(200).json({
      message: "Health information saved successfully",
      health: user.health,
    });
  } catch (error) {
    console.error("Error saving health info:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const getHealthInfo = async (req, res) => {
  const  userId  = req.user._id;    
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({
        message: "Health information retrieved successfully",
        health: user.health,
        });
    } catch (error) {
        console.error("Error retrieving health info:", error);
        res.status(500).json({ message: "Server error", error });
    }
}


const updateHealthInfo = async (req, res) => {
  const  userId  = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { height, weight, bloodGroup, diseases, allergies, medications, notes } = req.body;
    user.health.height = height;
    user.health.weight = weight;
    user.health.bloodGroup = bloodGroup;
    user.health.diseases = diseases
    user.health.allergies = allergies;
    user.health.medications = medications;
    user.health.notes = notes;
    user.health.lastUpdated = new Date();
    await user.save();
    res.status(200).json({ message: "Health information updated successfully", health: user.health });

    // Save updated health info to memory
   await Memory.create({
      content: `Updated health information for ${user.name}: Height: ${height}, Weight: ${weight}, Blood Group: ${bloodGroup}, Diseases: ${diseases}, Allergies: ${allergies}, Medications: ${medications}, Notes: ${notes}`,
    });

    
  } catch (error) {
    console.error("Error updating health info:", error);
    res.status(500).json({ message: "Server error", error });
  }
}


const addDoseSchedule = async (req, res) => {
  const  userId  = req.user._id;
  const { medicine, dosage, time, notes } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const newDose = { medicine, dosage, time, notes };

    user.health.doseSchedule.push(newDose);
    user.health.lastUpdated = new Date();

    await user.save();
    // Save dose schedule to memory
    await Memory.create({
      content: `Dose schedule added for ${user.name}: Medicine: ${medicine}, Dosage: ${dosage}, Time: ${time}, Notes: ${notes}`,
    });

    res.status(200).json({ message: "Dose schedule added", schedule: newDose });
  } catch (error) {
    res.status(500).json({ message: "Failed to add schedule", error });
  }
};


const getDoseInfo = async (req, res) => {
    const  userId  = req.user._id;
    
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({
        message: "Dose schedule retrieved successfully",
        schedule: user.health.doseSchedule,
        });
    } catch (error) {
        console.error("Error retrieving dose schedule:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

const changeDoseSchedule = async (req, res) => {
  const  userId  = req.user._id;
    const { scheduleId } = req.params;
  const { medicine, dosage, time, notes } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });  
    const dose = user.health.doseSchedule.id(scheduleId);
    console.log(scheduleId);
    
    if (!dose) return res.status(404).json({ message: "Dose schedule not found" });
    dose.medicine = medicine;
    dose.dosage = dosage;
    dose.time = time;
    dose.notes = notes;
    user.health.lastUpdated = new Date();
    await user.save();
    // Save updated dose schedule to memory
    await Memory.create({
      content: `Dose schedule updated for ${user.name}: Medicine: ${medicine}, Dosage: ${dosage}, Time: ${time}, Notes: ${notes}`,
    });
    
    res.status(200).json({ message: "Dose schedule updated", schedule: dose });
    }
    catch (error) {
    res.status(500).json({ message: "Failed to update schedule", error });
    }
}
const deleteDoseSchedule = async (req, res) => {
  const  userId  = req.user._id;
  const { scheduleId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const dose = user.health.doseSchedule.id(scheduleId);
    if (!dose) return res.status(404).json({ message: "Dose schedule not found" });
    dose.remove();
    user.health.lastUpdated = new Date();  
    await user.save();
    
    res.status(200).json({ message: "Dose schedule deleted" });
    }
    catch (error) {
    res.status(500).json({ message: "Failed to delete schedule", error });
    }
}


module.exports = { addDoseSchedule, createHealthInfo, getHealthInfo, updateHealthInfo, getDoseInfo, changeDoseSchedule, deleteDoseSchedule };