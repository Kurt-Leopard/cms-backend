import express from "express";
import authController from "../controllers/authController.mjs";

const router = express.Router();

router.post("/api/login", authController.login);
router.post("/api/register", authController.register);

export { router };
