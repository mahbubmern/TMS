import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const publicPath = join(__dirname, "../../Files/Incoming/");
    cb(null, publicPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

export const userPhoto = multer({ storage }).single("photo");
export const incomingFile = multer({ storage }).single("file");
