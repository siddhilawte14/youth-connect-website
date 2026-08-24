import { getStore } from '../config/database.js';

export const broadcastRepository = {
  findAll() {
    return getStore().broadcasts;
  },

  findByEventId(eventId) {
    return getStore().broadcasts.filter(b => b.eventId === eventId);
  },

  create(broadcastData) {
    const broadcast = {
      ...broadcastData,
      id: `bcast-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
    getStore().broadcasts.push(broadcast);
    return broadcast;
  },
};
