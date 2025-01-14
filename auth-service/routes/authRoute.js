import express from "express";
import { login, register, logout } from "../controller/authController.js";

const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Logout route
router.get("/logout", logout);

export default router;
