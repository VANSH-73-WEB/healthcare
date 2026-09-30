const mongoose = require("mongoose");

// Mirrors on-chain consent grants so the patient dashboard can list
// "doctors who currently have access" without scanning blockchain events.
// The blockchain call (hasConsent) is still the authoritative check used
// before any record is ever returned.
const consentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorWallet: { type: String, required: true, lowercase: true },
    status: { type: String, enum: ["GRANTED", "REVOKED"], default: "GRANTED" },
    txHash: { type: String, required: true },
  },
  { timestamps: true }
);

consentSchema.index({ patient: 1, doctor: 1 });

module.exports = mongoose.model("Consent", consentSchema);
