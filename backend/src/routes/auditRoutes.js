import express from 'express';
import AuditLog from '../models/auditLogModel.js';
import { authenticateUser, authorizePermission } from '../middleware/authMiddleware.js';
import { sendSuccess } from '../utils/responseFormatter.js';

const router = express.Router();

router.use(authenticateUser);

/**
 * @desc    Get all system audit logs
 * @route   GET /api/audit-logs
 * @access  Private (users with logs.read permission or ADMIN)
 */
router.get('/', authorizePermission('logs.read'), async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('actor', 'name email role')
      .populate('targetUser', 'name email role')
      .sort({ timestamp: -1 });

    return sendSuccess(res, 'Audit logs retrieved successfully', { logs });
  } catch (error) {
    next(error);
  }
});

export default router;
