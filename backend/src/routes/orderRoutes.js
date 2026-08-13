import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createStaffOrder,
  updateOrder,
  uploadBillImage
} from '../controllers/orderController.js';
import { authenticateUser, authorizePermission } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticateUser);

router.get('/', authorizePermission('order.read'), getOrders);
router.post('/bill-image', authorizePermission('order.write'), uploadBillImage);
router.get('/:id', authorizePermission('order.read'), getOrderById);
router.post('/', authorizePermission('order.write'), createStaffOrder);
router.patch('/:id', authorizePermission('order.write'), updateOrder);

export default router;
