import { Router } from "express";
import bookC from "../controllers/bookC.js";
import multer from "multer";
import { authenticate } from "../middleware/authM.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post("/", authenticate, upload.single("image"), (req, res) => {
  const imageName = req.file ? req.file.filename : null;
  bookC.addBook(req, res, imageName);
});

router.get("/:id", authenticate, bookC.getBookByID);
router.put("/:id", authenticate, bookC.updateBook);
router.delete("/:id", authenticate, bookC.deleteBook);
router.get("/", authenticate, bookC.getBooks);
router.get("/search", authenticate, bookC.searchBook);

export default router;
