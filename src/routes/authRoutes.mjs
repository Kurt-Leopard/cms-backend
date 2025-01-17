import express from "express";
import authController from "../controllers/authController.mjs";
import { verifyUser } from "../middleware/authentication.mjs";
const router = express.Router();

router.post("/api/login", authController.login);
router.post("/api/register", authController.register);
router.get(
  "/api/authorize-user",
  verifyUser ? verifyUser : "",
  authController.verifyToken
);

export { router };
