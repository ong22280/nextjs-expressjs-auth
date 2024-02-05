import express from "express";
import { getMe, getUser } from "../controllers/userController";

const router = express.Router();

router.get("/me", getMe);
router.get("id/:id", getUser);

export default router;
