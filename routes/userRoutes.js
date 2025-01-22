import express from 'express';
import { registerUser, loginUser, getUserDetails } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // Assuming this middleware checks for JWT token

const router = express.Router();

// Register a new user (Owner)
router.post('/register', registerUser);

// Login user (Owner)
router.post('/login', loginUser);

// Get user details (Authenticated)
router.get('/me', authMiddleware, getUserDetails);

export default router;
