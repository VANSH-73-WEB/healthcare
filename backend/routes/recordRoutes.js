const express = require("express");
const multer = require("multer");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { uploadRecord, getMyRecords, getPatientRecords } = require("../controllers/recordController");

// Files are held in memory just long enough to hash + push to IPFS; nothing
// is written to local disk on the server.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

router.post("/upload", protect, upload.single("file"), uploadRecord);
router.get("/mine", protect, getMyRecords);
router.get("/patient/:patientEmail", protect, getPatientRecords);

module.exports = router;
