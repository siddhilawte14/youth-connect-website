import { eventService } from '../services/eventService.js';
import { successResponse, createdResponse } from '../utils/response.js';

export const eventController = {
  listEvents(req, res, next) {
    try {
      const { category, area, status, search, page, limit } = req.query;
      const result = eventService.listEvents({
        category, area, status, search,
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
      });
      return successResponse(res, result, 'Events retrieved');
    } catch (err) { next(err); }
  },

  getEvent(req, res, next) {
    try {
      const event = eventService.getEventById(req.params.id);
      return successResponse(res, event, 'Event retrieved');
    } catch (err) { next(err); }
  },

  createEvent(req, res, next) {
    try {
      const event = eventService.createEvent(req.body, req.user);
      return createdResponse(res, event, 'Event created');
    } catch (err) { next(err); }
  },

  updateEvent(req, res, next) {
    try {
      const event = eventService.updateEvent(req.params.id, req.body, req.user);
      return successResponse(res, event, 'Event updated');
    } catch (err) { next(err); }
  },

  deleteEvent(req, res, next) {
    try {
      eventService.deleteEvent(req.params.id, req.user);
      return successResponse(res, null, 'Event deleted');
    } catch (err) { next(err); }
  },

  getOrganizerEvents(req, res, next) {
    try {
      const events = eventService.getOrganizerEvents(req.user.id);
      return successResponse(res, events, 'Organizer events retrieved');
    } catch (err) { next(err); }
  },
};
