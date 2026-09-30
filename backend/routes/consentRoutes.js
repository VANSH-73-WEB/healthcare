const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  grantConsent,
  revokeConsent,
  myGrantedDoctors,
  checkConsent,
} = require("../controllers/consentController");

router.post("/grant", protect, grantConsent);
router.post("/revoke", protect, revokeConsent);
router.get("/my-doctors", protect, myGrantedDoctors);
router.get("/check/:patientWallet", protect, checkConsent);

module.exports = router;
