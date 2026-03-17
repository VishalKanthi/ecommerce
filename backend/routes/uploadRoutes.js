const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.error("Multer error details:", err);
      return res.status(500).json({ message: err.message || "Multer failed" });
    }
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      res.json({
        url: req.file.path,
        public_id: req.file.filename
      });
    } catch (error) {
      console.error("Upload route error details:", error);
      res.status(500).json({ message: error.message || "Failed to process upload" });
    }
  });
});

module.exports = router;