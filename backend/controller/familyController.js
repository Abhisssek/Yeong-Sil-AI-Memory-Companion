const User = require("../models/userSchema");
const { isValidPhoneNumber } = require("libphonenumber-js");
const Memory = require("../models/memorySchema");

const addFamilyMember = async (req, res) => {
  const  userId  = req.user._id;
 
  const { name, relation, mobile } = req.body;

  if (!name || !relation || !mobile?.countryCode || !mobile?.number) {
    return res.status(400).json({ error: "Name, relation, and full mobile (countryCode + number) are required" });
  }

  const fullNumber = `${mobile.countryCode}${mobile.number}`;
  if (!isValidPhoneNumber(fullNumber)) {
    return res.status(400).json({ error: "Invalid mobile number format" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.familyMembers.push({ name, relation, mobile });
    await user.save();

    // Save the family member's information in memory
    await Memory.create({
      content: `Family member added: ${name}, Relation: ${relation}, Mobile: ${mobile.countryCode}${mobile.number}`,
    });

    res.status(200).json({
      message: "Family member added",
      familyMembers: user.familyMembers,
    });
  } catch (error) {
    console.error("Add Family Member Error:", error);
    res.status(500).json({ error: "Server error while adding family member" });
  }
};
const getFamilyMembers = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      message: "Family members retrieved",
      familyMembers: user.familyMembers,
    });
  } catch (error) {
    console.error("Get Family Members Error:", error);
    res.status(500).json({ error: "Server error while retrieving family members" });
  }
};

module.exports = {
  addFamilyMember,
  getFamilyMembers,
};