import express from 'express';
import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  regenerateTableQr
} from '../controllers/tableController.js';
import { authenticateUser, authorizePermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce authentication for all admin-facing table management endpoints
router.use(authenticateUser);

router.get('/', authorizePermission('tables.read'), getTables);
router.get('/:id', authorizePermission('tables.read'), getTableById);
router.post('/', authorizePermission('tables.create'), createTable);
router.put('/:id', authorizePermission('tables.update'), updateTable);
router.delete('/:id', authorizePermission('tables.delete'), deleteTable);
router.post('/:id/regenerate-qr', authorizePermission('tables.qr.generate'), regenerateTableQr);

export default router;
