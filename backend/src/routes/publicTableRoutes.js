import express from 'express';
import {
  getPublicTableDetails,
  placeTableOrder,
  getGuestOrdersByPhone
} from '../controllers/publicTableController.js';

const router = express.Router();

// Before /:slug so "guest" is not treated as a slug
router.get('/guest/orders', getGuestOrdersByPhone);
router.get('/:slug', getPublicTableDetails);
router.post('/:slug/orders', placeTableOrder);

export default router;
