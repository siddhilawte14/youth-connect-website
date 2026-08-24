import { clubRepository, communityUpdateRepository } from '../repositories/communityRepository.js';
import { AppError } from '../utils/response.js';

export const communityService = {
  /**
   * List all community clubs.
   */
  listClubs() {
    return clubRepository.findAll();
  },

  /**
   * Get a single club by ID.
   */
  getClubById(id) {
    const club = clubRepository.findById(id);
    if (!club) throw new AppError('Club not found', 404, 'NOT_FOUND');
    return club;
  },

  /**
   * List community feed updates.
   */
  listUpdates() {
    return communityUpdateRepository.findAll();
  },

  /**
   * Create a club (admin only).
   */
  createClub(data) {
    return clubRepository.create(data);
  },

  /**
   * Update a club (admin only).
   */
  updateClub(id, updates) {
    const club = clubRepository.update(id, updates);
    if (!club) throw new AppError('Club not found', 404, 'NOT_FOUND');
    return club;
  },
};
