import { passService } from '../services/passService.js';
import { successResponse, createdResponse } from '../utils/response.js';

export const passController = {
  registerForEvent(req, res, next) {
    try {
      const pass = passService.registerForEvent(req.body, req.user);
      return createdResponse(res, pass, 'Registration successful. Digital pass issued.');
    } catch (err) { next(err); }
  },

  getMyPasses(req, res, next) {
    try {
      const passes = passService.getMyPasses(req.user.id);
      return successResponse(res, passes, 'Passes retrieved');
    } catch (err) { next(err); }
  },

  getPassByTicketId(req, res, next) {
    try {
      const pass = passService.getPassByTicketId(req.params.ticketId, req.user.id);
      return successResponse(res, pass, 'Pass retrieved');
    } catch (err) { next(err); }
  },

  getEventAttendees(req, res, next) {
    try {
      const attendees = passService.getEventAttendees(req.params.eventId, req.user);
      return successResponse(res, attendees, 'Attendees retrieved');
    } catch (err) { next(err); }
  },
};
