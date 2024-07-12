import { Router } from "express";
import userC from "../controllers/userC.js";

const router = Router();

router.post("/register", userC.register);
router.post("/login", userC.login);

export default router;
