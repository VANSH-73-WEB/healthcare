const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function sanitize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    walletAddress: user.walletAddress,
    specialization: user.specialization,
  };
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, walletAddress, specialization } = req.body;

    if (!name || !email || !password || !walletAddress) {
      return res.status(400).json({ message: "name, email, password, and walletAddress are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: role || "patient",
      walletAddress: walletAddress.toLowerCase(),
      specialization,
    });

    const token = signToken(user);
    res.status(201).json({ token, user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    res.json({ token, user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};
