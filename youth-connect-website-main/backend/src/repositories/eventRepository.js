import { getStore } from '../config/database.js';

export const eventRepository = {
  findAll({ category, area, status, search, excludeDeleted = true } = {}) {
    let events = getStore().events;

    if (excludeDeleted) {
      events = events.filter(e => !e.isDeleted);
    }

    if (category) {
      events = events.filter(e => e.category === category);
    }
    if (area) {
      events = events.filter(e => e.area === area);
    }
    if (status) {
      events = events.filter(e => e.status === status);
    }
    if (search) {
      const lower = search.toLowerCase();
      events = events.filter(
        e => e.title.toLowerCase().includes(lower) ||
             e.description.toLowerCase().includes(lower) ||
             e.venue.toLowerCase().includes(lower)
      );
    }

    return events;
  },

  findById(id) {
    return getStore().events.find(e => e.id === id && !e.isDeleted) || null;
  },

  findByIdIncludeDeleted(id) {
    return getStore().events.find(e => e.id === id) || null;
  },

  findByOrganizer(organizerId) {
    return getStore().events.filter(e => e.organizerId === organizerId && !e.isDeleted);
  },

  create(eventData) {
    const event = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      registeredCount: 0,
      views: 0,
      conversionRate: '0%',
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };
    getStore().events.push(event);
    return event;
  },

  update(id, updates) {
    const events = getStore().events;
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;
    events[index] = { ...events[index], ...updates };
    return events[index];
  },

  softDelete(id) {
    return this.update(id, { isDeleted: true });
  },

  incrementRegistration(id) {
    const event = this.findById(id);
    if (!event) return null;
    event.registeredCount += 1;
    return event;
  },
};
