import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { validate } from '../middlewares/validatorMiddleware.js';

const router = Router();

const studentLoginSchema = {
  emailOrPrn: { required: true, type: 'string', min: 3 },
  password: { required: true, type: 'string', min: 6 },
};

const organizerLoginSchema = {
  email: { required: true, type: 'string', min: 5, pattern: /@/, message: 'Valid email is required' },
  password: { required: true, type: 'string', min: 6 },
};

const registerSchema = {
  name: { required: true, type: 'string', min: 2, max: 100 },
  email: { required: true, type: 'string', min: 5, pattern: /@/, message: 'Valid email is required' },
  password: { required: true, type: 'string', min: 6 },
  role: { required: true, type: 'string', enum: ['student', 'organizer'] },
};

// POST /api/v1/auth/login/student
router.post('/login/student', authLimiter, validate(studentLoginSchema), authController.loginStudent);

// POST /api/v1/auth/login/organizer
router.post('/login/organizer', authLimiter, validate(organizerLoginSchema), authController.loginOrganizer);

// POST /api/v1/auth/register
router.post('/register', authLimiter, validate(registerSchema), authController.register);

// GET /api/v1/auth/profile
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
