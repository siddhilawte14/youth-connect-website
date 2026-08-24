import { Router } from 'express';
import { eventController } from '../controllers/eventController.js';
import { authMiddleware, optionalAuth } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { validate } from '../middlewares/validatorMiddleware.js';
import { EVENT_CATEGORIES } from '../constants/index.js';

const router = Router();

const createEventSchema = {
  title: { required: true, type: 'string', min: 3, max: 200 },
  category: { required: true, type: 'string', enum: EVENT_CATEGORIES },
  description: { required: true, type: 'string', min: 10 },
  venue: { required: true, type: 'string', max: 300 },
  area: { required: true, type: 'string' },
  fee: { required: true, type: 'number', min: 0 },
  capacity: { required: true, type: 'number', min: 1 },
  date: { required: true, type: 'object' },
};

// GET /api/v1/events - Public (optional auth for personalization)
router.get('/', optionalAuth, eventController.listEvents);

// GET /api/v1/events/mine - Organizer's own events
router.get('/mine', authMiddleware, requireRole('organizer', 'admin'), eventController.getOrganizerEvents);

// GET /api/v1/events/:id - Public
router.get('/:id', optionalAuth, eventController.getEvent);

// POST /api/v1/events - Organizer/Admin only
router.post('/', authMiddleware, requireRole('organizer', 'admin'), validate(createEventSchema), eventController.createEvent);

// PUT /api/v1/events/:id - Organizer/Admin only (object-level auth in service)
router.put('/:id', authMiddleware, requireRole('organizer', 'admin'), eventController.updateEvent);

// DELETE /api/v1/events/:id - Soft delete (object-level auth in service)
router.delete('/:id', authMiddleware, requireRole('organizer', 'admin'), eventController.deleteEvent);

export default router;
