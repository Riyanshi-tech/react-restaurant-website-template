import express from 'express';
import { 
  createUser, 
  getUsers, 
  updateUser, 
  deleteUser 
} from '../controllers/userController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(authenticateUser);

// CRUD endpoints with Role-Based Access Control (RBAC)
router.post('/', authorizeRoles('ADMIN'), createUser);
router.get('/', authorizeRoles('ADMIN', 'MANAGER'), getUsers);
router.put('/:id', authorizeRoles('ADMIN'), updateUser);
router.delete('/:id', authorizeRoles('ADMIN'), deleteUser);

export default router;
