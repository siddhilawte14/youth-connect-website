import { Router } from 'express';
import { gateScannerController } from '../controllers/gateScannerController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { validate } from '../middlewares/validatorMiddleware.js';

const router = Router();

const verifySchema = {
  ticketCode: { required: true, type: 'string', min: 1 },
};

const redeemSchema = {
  ticketCode: { required: true, type: 'string', min: 1 },
};

// POST /api/v1/gate/verify - Verify a ticket
router.post('/verify', authMiddleware, requireRole('organizer', 'admin'), validate(verifySchema), gateScannerController.verifyTicket);

// POST /api/v1/gate/redeem - Redeem (check-in) a ticket
router.post('/redeem', authMiddleware, requireRole('organizer', 'admin'), validate(redeemSchema), gateScannerController.redeemTicket);

export default router;
