const mongoose = require("mongoose");

// This collection mirrors on-chain records so the app can query/filter/search
// quickly without hitting the blockchain every time. The blockchain remains
// the single source of truth for the hash + access control; MongoDB only
// caches metadata for a fast, friendly UI.
const recordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientWallet: { type: String, required: true, lowercase: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true, trim: true },
    ipfsHash: { type: String, required: true }, // CID returned by IPFS
    txHash: { type: String, required: true },   // Ethereum transaction hash
    fileName: { type: String },
    fileType: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", recordSchema);
