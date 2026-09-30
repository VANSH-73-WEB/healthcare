const User = require("../models/User");
const Consent = require("../models/Consent");
const { hasConsentOnChain } = require("../utils/blockchain");

// The patient's wallet signs grantConsent / revokeConsent in the browser.
// These endpoints only verify the on-chain result and mirror it into MongoDB.

// Frontend needs the doctor's wallet address to build the MetaMask transaction.
exports.getDoctorByEmail = async (req, res) => {
  try {
    const doctor = await User.findOne({
      email: req.params.email.toLowerCase(),
      role: { $in: ["doctor", "hospital"] },
    });
    if (!doctor) {
      return res.status(404).json({ message: "No doctor/hospital found with that email" });
    }
    res.json({ name: doctor.name, walletAddress: doctor.walletAddress });
  } catch (err) {
    res.status(500).json({ message: "Failed to look up doctor", error: err.message });
  }
};

// Patient records a consent grant that they already signed on-chain.
exports.grantConsent = async (req, res) => {
  try {
    const { doctorEmail, txHash } = req.body;
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can grant consent" });
    }
    const doctor = await User.findOne({
      email: (doctorEmail || "").toLowerCase(),
      role: { $in: ["doctor", "hospital"] },
    });
    if (!doctor) {
      return res.status(404).json({ message: "No doctor/hospital found with that email" });
    }

    const onChain = await hasConsentOnChain(req.user.walletAddress, doctor.walletAddress);
    if (!onChain) {
      return res.status(400).json({
        message: "No consent found on-chain. Confirm the MetaMask transaction with your registered wallet.",
      });
    }

    await Consent.findOneAndUpdate(
      { patient: req.user._id, doctor: doctor._id },
      { doctorWallet: doctor.walletAddress, status: "GRANTED", txHash: txHash || "on-chain" },
      { upsert: true, new: true }
    );
    res.status(201).json({ message: `Consent granted to ${doctor.name}`, txHash });
  } catch (err) {
    res.status(500).json({ message: "Failed to grant consent", error: err.message });
  }
};

// Patient records a revoke that they already signed on-chain.
exports.revokeConsent = async (req, res) => {
  try {
    const { doctorEmail } = req.body;
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can revoke consent" });
    }
    const doctor = await User.findOne({ email: (doctorEmail || "").toLowerCase() });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const stillOn = await hasConsentOnChain(req.user.walletAddress, doctor.walletAddress);
    if (stillOn) {
      return res.status(400).json({
        message: "Consent is still active on-chain. Confirm the revoke in MetaMask first.",
      });
    }

    await Consent.findOneAndUpdate(
      { patient: req.user._id, doctor: doctor._id },
      { status: "REVOKED" }
    );
    res.json({ message: `Consent revoked for ${doctor.name}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to revoke consent", error: err.message });
  }
};

// List doctors who currently have consent for the logged-in patient.
exports.myGrantedDoctors = async (req, res) => {
  try {
    const grants = await Consent.find({ patient: req.user._id, status: "GRANTED" }).populate(
      "doctor",
      "name email specialization role walletAddress"
    );
    res.json({ doctors: grants.map((g) => g.doctor).filter(Boolean) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch consent list", error: err.message });
  }
};

// Doctor checks whether they currently have consent for a given patient wallet.
exports.checkConsent = async (req, res) => {
  try {
    const { patientWallet } = req.params;
    const allowed = await hasConsentOnChain(patientWallet, req.user.walletAddress);
    res.json({ allowed });
  } catch (err) {
    res.status(500).json({ message: "Failed to check consent", error: err.message });
  }
};