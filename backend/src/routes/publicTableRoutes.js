import express from 'express';
import { getPublicTableDetails, placeTableOrder } from '../controllers/publicTableController.js';

const router = express.Router();

// Public routes for QR-based customer ordering
router.get('/:slug', getPublicTableDetails);
router.post('/:slug/orders', placeTableOrder);

export default router;
