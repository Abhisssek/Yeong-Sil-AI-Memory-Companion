const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Register
const registerUser = async (req, res) => {
  const { name, email, password, age } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
    });

  
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
      },
     
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    if (!token) return res.status(500).json({ error: "Token generation failed." });
    // Optionally, you can set the token in a cookie
    res.cookie("token", token);


    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

// Logout (client can simply delete token; optional token blacklist for advanced use)
const logoutUser = async (req, res) => {
    // Optionally, you can blacklist the token or clear it from the client side
    // For example, if using a database to store blacklisted tokens:
    res.cookie("token", "", { expires: new Date(0), httpOnly: true, secure: true });
  res.json({ message: "Logout successful" });
};

module.exports = { registerUser, loginUser, logoutUser };
