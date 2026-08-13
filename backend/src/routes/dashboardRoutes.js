import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticateUser);
router.get('/stats', getDashboardStats);

export default router;
