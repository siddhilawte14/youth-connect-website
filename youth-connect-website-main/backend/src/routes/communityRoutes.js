import { Router } from 'express';
import { communityController } from '../controllers/communityController.js';

const router = Router();

// GET /api/v1/community/clubs
router.get('/clubs', communityController.listClubs);

// GET /api/v1/community/clubs/:id
router.get('/clubs/:id', communityController.getClub);

// GET /api/v1/community/updates
router.get('/updates', communityController.listUpdates);

export default router;
