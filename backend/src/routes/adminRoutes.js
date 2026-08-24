import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = Router();

// Secure all admin routes
router.use(authMiddleware);
router.use(requireRole('admin'));

// POST /api/v1/admin/events/:id/approve
router.post('/events/:id/approve', adminController.approveEvent);

// POST /api/v1/admin/events/:id/reject
router.post('/events/:id/reject', adminController.rejectEvent);

// POST /api/v1/admin/clubs/:id/toggle-verify
router.post('/clubs/:id/toggle-verify', adminController.toggleClubVerification);

// GET /api/v1/admin/audit-logs
router.get('/audit-logs', adminController.getAuditLogs);

// GET /api/v1/admin/stats
router.get('/stats', adminController.getDashboardStats);

export default router;
