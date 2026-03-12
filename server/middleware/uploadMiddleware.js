// server/middleware/uploadMiddleware.js
import multer from "multer";

// Use memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // console.log("File filter checking:", file.mimetype);

  // Accept images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max size
  },
});

export default upload;
