import express from "express";
const router = express.Router();
import multer from "multer";
import path from "path"; // Import the path module

const base = "https://node45.cs.colman.ac.il/";

// Use path.join to generate platform-specific file paths
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('public')); // Use path.join for platform-specific file paths
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Use path.extname to get file extension
    cb(null, Date.now() + ext); // Use path.extname to keep the extension intact
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single("file"), function (req, res) {
  const filePath = (req as any).file.path.replace(/\\/g, "/"); // Convert backslashes to forward slashes
  console.log("router.post(/file: " + base + filePath);
  res.status(200).send({ url: base + filePath });
});

export = router;
