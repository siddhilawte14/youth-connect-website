import { getStore } from '../config/database.js';

export const passRepository = {
  findByTicketId(ticketId) {
    return getStore().passes[ticketId] || null;
  },

  findByUserId(userId) {
    return Object.values(getStore().passes).filter(p => p.userId === userId);
  },

  findByEventId(eventId) {
    return Object.values(getStore().passes).filter(p => p.eventId === eventId);
  },

  findByUserAndEvent(userId, eventId) {
    return Object.values(getStore().passes).find(
      p => p.userId === userId && p.eventId === eventId
    ) || null;
  },

  findAll() {
    return Object.values(getStore().passes);
  },

  create(passData) {
    getStore().passes[passData.ticketId] = passData;
    return passData;
  },

  update(ticketId, updates) {
    const pass = getStore().passes[ticketId];
    if (!pass) return null;
    getStore().passes[ticketId] = { ...pass, ...updates };
    return getStore().passes[ticketId];
  },

  updateStatus(ticketId, status) {
    return this.update(ticketId, { status });
  },
};
