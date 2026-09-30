const User = require("../models/User");
const Record = require("../models/Record");
const { uploadToIPFS, gatewayUrlFor } = require("../utils/ipfs");
const { addRecordOnChain, hasConsentOnChain } = require("../utils/blockchain");

// Patient uploads their own record, or a consented doctor uploads on the
// patient's behalf (e.g. after a consultation).
exports.uploadRecord = async (req, res) => {
  try {
    const { patientEmail, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "A file is required (field name: file)" });
    }

    let patient;
    if (req.user.role === "patient") {
      patient = req.user;
    } else {
      if (!patientEmail) {
        return res.status(400).json({ message: "patientEmail is required when a doctor uploads a record" });
      }
      patient = await User.findOne({ email: patientEmail.toLowerCase(), role: "patient" });
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      const allowed = await hasConsentOnChain(patient.walletAddress, req.user.walletAddress);
      if (!allowed) {
        return res.status(403).json({ message: "You do not have patient consent to add records" });
      }
    }

    const ipfsHash = await uploadToIPFS(req.file.buffer);
    const txHash = await addRecordOnChain(patient.walletAddress, ipfsHash, description || req.file.originalname);

    const record = await Record.create({
      patient: patient._id,
      patientWallet: patient.walletAddress,
      uploadedBy: req.user._id,
      description: description || req.file.originalname,
      ipfsHash,
      txHash,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
    });

    res.status(201).json({
      message: "Record added and anchored on-chain",
      record,
      fileUrl: gatewayUrlFor(ipfsHash),
      txHash,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload record", error: err.message });
  }
};

// Patient views their own records.
exports.getMyRecords = async (req, res) => {
  try {
    const records = await Record.find({ patient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name role");
    res.json({ records });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch records", error: err.message });
  }
};

// Doctor views a specific patient's records, gated by on-chain consent.
exports.getPatientRecords = async (req, res) => {
  try {
    const { patientEmail } = req.params;
    const patient = await User.findOne({ email: patientEmail.toLowerCase(), role: "patient" });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const allowed = await hasConsentOnChain(patient.walletAddress, req.user.walletAddress);
    if (!allowed) {
      return res.status(403).json({ message: "You do not have consent to view this patient's records" });
    }

    const records = await Record.find({ patient: patient._id })
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name role");

    res.json({ patient: { name: patient.name, email: patient.email }, records });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch patient records", error: err.message });
  }
};
