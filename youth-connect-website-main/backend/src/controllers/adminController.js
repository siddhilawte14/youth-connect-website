import { adminService } from '../services/adminService.js';
import { successResponse } from '../utils/response.js';

export const adminController = {
  approveEvent(req, res, next) {
    try {
      const event = adminService.approveEvent(req.params.id, req.user);
      return successResponse(res, event, 'Event approved');
    } catch (err) { next(err); }
  },

  rejectEvent(req, res, next) {
    try {
      const { reason } = req.body;
      const event = adminService.rejectEvent(req.params.id, reason || 'No reason provided', req.user);
      return successResponse(res, event, 'Event rejected');
    } catch (err) { next(err); }
  },

  toggleClubVerification(req, res, next) {
    try {
      const club = adminService.toggleClubVerification(req.params.id, req.user);
      return successResponse(res, club, `Club verification ${club.isVerified ? 'granted' : 'revoked'}`);
    } catch (err) { next(err); }
  },

  getAuditLogs(req, res, next) {
    try {
      const { limit, offset } = req.query;
      const result = adminService.getAuditLogs({
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
      });
      return successResponse(res, result, 'Audit logs retrieved');
    } catch (err) { next(err); }
  },

  getDashboardStats(req, res, next) {
    try {
      const stats = adminService.getDashboardStats();
      return successResponse(res, stats, 'Dashboard stats retrieved');
    } catch (err) { next(err); }
  },
};
