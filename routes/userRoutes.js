const express = require("express");
const User = require("../model/User");
const router = express.Router();
const twilio = require("twilio");

const accountSid = process.env.ACCOUNT_SID; // Your Twilio Account SID
const authToken = process.env.AUTH_TOKEN; // Your Twilio Auth Token
const client = new twilio(accountSid, authToken);

// In-memory storage for user data and OTP (consider using Redis or DB for production)
const otpStore = new Map();
const userStore = new Map(); // Temporarily store user data

// Route to handle user registration and send OTP
router.post("/users", async (req, res) => {
  try {
    const { name, address, email, password, phone, state, city } = req.body;
    // console.log(phone);
    // Check if phone number already exists in the system (if applicable)
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP to user's phone number
    await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: "+13343731954",
      to: phone, // User's phone number
    });

    // Temporarily store user data and OTP (store in a more persistent way in production)
    userStore.set(phone, {
      name,
      address,
      email,
      password,
      state,
      city,
      phone,
    });
    otpStore.set(phone, otp);

    res.status(200).json({
      message: "OTP sent successfully, please verify your phone number.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to send OTP. Please try again later." });
  }
});

// Route to verify OTP and complete registration
router.post("/users/verify", async (req, res) => {
  console.log("Verification request received:", req.body);
  try {
    const { phone, otp } = req.body;

    // Check if OTP is valid
    const storedOtp = otpStore.get(phone);
    const storedUserData = userStore.get(phone);
    console.log("Stored OTP:", storedOtp);
    console.log("Received OTP:", otp);
    console.log("Stored User Data:", storedUserData);

    if (!storedOtp || !storedUserData) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    if (storedOtp.toString() !== otp.toString()) {
      console.log("OTP comparison failed"); // Log comparison failure
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    // Save the user to the database
    const newUser = new User(storedUserData); // Retrieve user data from temporary store
    console.log("User data being saved:", storedUserData);
    try {
      await newUser.save();
      console.log("User saved successfully:", newUser);
    } catch (error) {
      console.error("Error saving user:", error); // Log any errors during user saving
      return res.status(500).json({ error: "Failed to save user." });
    }

    // Remove the OTP and user data from temporary storage
    otpStore.delete(phone);
    userStore.delete(phone);

    res.status(201).json({
      message: "Phone number verified and user registered successfully",
      newUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to verify OTP and complete registration." });
  }
});

// CREATE a new user (POST)
// router.post('/users', async (req, res) => {
//   try {
//     const { name, address, email, password, phone, state, city } = req.body;
//     const newUser = new User({ name, address, email, password, phone, state, city });
//     await newUser.save();
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// READ all users (GET)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ a single user by ID (GET)
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a user by ID (PUT)
// router.put('/users/:id', async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedUser) return res.status(404).json({ error: 'User not found' });
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// UPDATE a user by ID (PUT)
router.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a user by ID (DELETE)
router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// 2WQR8GD58BGWS3ZUHXDJXT73
