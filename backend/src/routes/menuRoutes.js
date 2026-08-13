import { Router } from 'express';
import multer from 'multer';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuImage
} from '../controllers/menuController.js';
import { authenticateUser, authorizePermission } from '../middleware/authMiddleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const router = Router();
router.use(authenticateUser);

router.get('/', authorizePermission('menu.read'), getMenuItems);
router.post('/upload', authorizePermission('menu.write'), upload.single('image'), uploadMenuImage);
router.get('/:id', authorizePermission('menu.read'), getMenuItemById);
router.post('/', authorizePermission('menu.write'), createMenuItem);
router.put('/:id', authorizePermission('menu.write'), updateMenuItem);
router.delete('/:id', authorizePermission('menu.write'), deleteMenuItem);

export default router;
