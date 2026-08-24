import { Router } from 'express';
import { passController } from '../controllers/passController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { validate } from '../middlewares/validatorMiddleware.js';

const router = Router();

const registerSchema = {
  eventId: { required: true, type: 'string' },
  fullName: { required: true, type: 'string', min: 2, max: 100 },
  collegeId: { required: true, type: 'string', min: 2 },
  department: { required: true, type: 'string' },
  amountPaid: { required: true, type: 'number', min: 0 },
};

// POST /api/v1/passes/register - Register for an event
router.post('/register', authMiddleware, validate(registerSchema), passController.registerForEvent);

// GET /api/v1/passes/mine - Get authenticated user's passes
router.get('/mine', authMiddleware, passController.getMyPasses);

// GET /api/v1/passes/:ticketId - Get specific pass
router.get('/:ticketId', authMiddleware, passController.getPassByTicketId);

// GET /api/v1/passes/event/:eventId/attendees - Get event attendees (organizer/admin)
router.get('/event/:eventId/attendees', authMiddleware, requireRole('organizer', 'admin'), passController.getEventAttendees);

export default router;
