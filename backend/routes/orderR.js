import { Router } from "express";
import orderC from "../controllers/orderC.js";
import { authenticate } from "../middleware/authM.js";

const router = Router();

router.post("/", authenticate, orderC.createOrder);
router.get("/", authenticate, orderC.getOrders);
router.get("/admin", authenticate, orderC.getAllOrders);

export default router;
