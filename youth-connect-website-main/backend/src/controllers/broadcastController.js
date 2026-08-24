import { broadcastService } from '../services/broadcastService.js';
import { successResponse, createdResponse } from '../utils/response.js';

export const broadcastController = {
  sendBroadcast(req, res, next) {
    try {
      const broadcast = broadcastService.sendBroadcast(req.body, req.user);
      return createdResponse(res, broadcast, 'Broadcast sent successfully');
    } catch (err) { next(err); }
  },

  getEventBroadcasts(req, res, next) {
    try {
      const broadcasts = broadcastService.getEventBroadcasts(req.params.eventId, req.user);
      return successResponse(res, broadcasts, 'Broadcasts retrieved');
    } catch (err) { next(err); }
  },
};
