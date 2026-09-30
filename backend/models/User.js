const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["patient", "doctor", "hospital"],
      default: "patient",
    },
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum wallet address"],
    },
    specialization: { type: String, trim: true }, // used for doctors
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
