import { getStore } from '../config/database.js';

export const clubRepository = {
  findAll() {
    return getStore().clubs;
  },

  findById(id) {
    return getStore().clubs.find(c => c.id === id) || null;
  },

  create(clubData) {
    const club = {
      ...clubData,
      id: `club-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    };
    getStore().clubs.push(club);
    return club;
  },

  update(id, updates) {
    const clubs = getStore().clubs;
    const index = clubs.findIndex(c => c.id === id);
    if (index === -1) return null;
    clubs[index] = { ...clubs[index], ...updates };
    return clubs[index];
  },
};

export const communityUpdateRepository = {
  findAll() {
    return getStore().communityUpdates;
  },

  create(updateData) {
    const update = {
      ...updateData,
      id: `upd-${Date.now()}`,
    };
    getStore().communityUpdates.push(update);
    return update;
  },
};
