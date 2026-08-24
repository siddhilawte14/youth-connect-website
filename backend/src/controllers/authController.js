import { authService } from '../services/authService.js';
import { successResponse, createdResponse } from '../utils/response.js';

export const authController = {
  async loginStudent(req, res, next) {
    try {
      const { emailOrPrn, password, name, college } = req.body;
      const result = await authService.loginStudent(emailOrPrn, password);
      return successResponse(res, result, 'Login successful');
    } catch (err) { next(err); }
  },

  async loginOrganizer(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginOrganizer(email, password);
      return successResponse(res, result, 'Login successful');
    } catch (err) { next(err); }
  },

  async register(req, res, next) {
    try {
      const { name, email, password, role, college, department, prn } = req.body;
      const result = await authService.register({ name, email, password, role, college, department, prn });
      return createdResponse(res, result, 'Registration successful');
    } catch (err) { next(err); }
  },

  async getProfile(req, res, next) {
    try {
      const user = authService.getProfile(req.user.id);
      return successResponse(res, user, 'Profile retrieved');
    } catch (err) { next(err); }
  },

  async updateProfile(req, res, next) {
    try {
      const updated = await authService.updateProfile(req.user.id, req.body);
      return successResponse(res, updated, 'Profile updated successfully');
    } catch (err) { next(err); }
  },
};
