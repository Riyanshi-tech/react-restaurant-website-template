import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.post('/logout', authenticateUser, logout);
router.get('/me', authenticateUser, getMe);

export default router;
