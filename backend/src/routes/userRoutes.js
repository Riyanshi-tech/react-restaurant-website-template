import express from 'express';
import { 
  createUser, 
  getUsers, 
  updateUser, 
  deleteUser,
  logAccessAs
} from '../controllers/userController.js';
import { authenticateUser, authorizePermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(authenticateUser);

// CRUD endpoints secured with permission-based access control
router.post('/', authorizePermission('users.write'), createUser);
router.get('/', authorizePermission('users.read'), getUsers);
router.put('/:id', authorizePermission('users.write'), updateUser);
router.delete('/:id', authorizePermission('users.write'), deleteUser);
router.post('/:id/access-as', authorizePermission('users.write'), logAccessAs);

export default router;
