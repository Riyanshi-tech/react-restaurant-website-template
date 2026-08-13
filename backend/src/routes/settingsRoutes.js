import { Router } from 'express';
import { getSettings, getBillingSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticateUser, authorizePermission } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticateUser);

router.get('/billing', getBillingSettings);
router.get('/', authorizePermission('settings.read'), getSettings);
router.put('/', authorizePermission('settings.write'), updateSettings);

export default router;
