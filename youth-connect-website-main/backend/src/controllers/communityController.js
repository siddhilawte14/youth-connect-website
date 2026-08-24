import { communityService } from '../services/communityService.js';
import { successResponse, createdResponse } from '../utils/response.js';

export const communityController = {
  listClubs(req, res, next) {
    try {
      const clubs = communityService.listClubs();
      return successResponse(res, clubs, 'Clubs retrieved');
    } catch (err) { next(err); }
  },

  getClub(req, res, next) {
    try {
      const club = communityService.getClubById(req.params.id);
      return successResponse(res, club, 'Club retrieved');
    } catch (err) { next(err); }
  },

  listUpdates(req, res, next) {
    try {
      const updates = communityService.listUpdates();
      return successResponse(res, updates, 'Community updates retrieved');
    } catch (err) { next(err); }
  },

  createClub(req, res, next) {
    try {
      const club = communityService.createClub(req.body);
      return createdResponse(res, club, 'Club created');
    } catch (err) { next(err); }
  },

  updateClub(req, res, next) {
    try {
      const club = communityService.updateClub(req.params.id, req.body);
      return successResponse(res, club, 'Club updated');
    } catch (err) { next(err); }
  },
};
