import { Router } from 'express';
import { broadcastController } from '../controllers/broadcastController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { validate } from '../middlewares/validatorMiddleware.js';

const router = Router();

const broadcastSchema = {
  eventId: { required: true, type: 'string' },
  subject: { required: true, type: 'string', min: 3, max: 200 },
  message: { required: true, type: 'string', min: 5 },
};

// POST /api/v1/broadcasts - Send a broadcast
router.post('/', authMiddleware, requireRole('organizer', 'admin'), validate(broadcastSchema), broadcastController.sendBroadcast);

// GET /api/v1/broadcasts/event/:eventId - Get broadcasts for an event
router.get('/event/:eventId', authMiddleware, requireRole('organizer', 'admin'), broadcastController.getEventBroadcasts);

export default router;
