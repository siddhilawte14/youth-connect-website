import { eventRepository } from '../repositories/eventRepository.js';
import { auditLogRepository } from '../repositories/auditLogRepository.js';
import { AppError } from '../utils/response.js';

export const eventService = {
  /**
   * List events with optional filters and pagination.
   */
  listEvents({ category, area, status, search, page = 1, limit = 20 } = {}) {
    let events = eventRepository.findAll({ category, area, status, search });

    // Sort: hot events first, then by date
    events.sort((a, b) => {
      if (a.isHot && !b.isHot) return -1;
      if (!a.isHot && b.isHot) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const total = events.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = events.slice(offset, offset + limit);

    return {
      events: paginated,
      pagination: { page, limit, total, totalPages },
    };
  },

  /**
   * Get a single event by ID.
   */
  getEventById(id) {
    const event = eventRepository.findById(id);
    if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');
    return event;
  },

  /**
   * Create a new event. Organizers and admins only.
   */
  createEvent(eventData, user) {
    const event = eventRepository.create({
      ...eventData,
      organizerId: user.id,
      organizer: {
        name: user.clubName || user.name,
        avatarUrl: user.avatarUrl || '',
        isVerified: false,
      },
    });

    auditLogRepository.create({
      action: 'Event Created',
      actor: user.name,
      target: event.title,
      status: 'Success',
    });

    return event;
  },

  /**
   * Update an event. Only the creator or admin can update.
   */
  updateEvent(id, updates, user) {
    const event = eventRepository.findById(id);
    if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');

    // Object-level authorization
    if (user.role !== 'admin' && event.organizerId !== user.id) {
      throw new AppError('You can only edit your own events', 403, 'AUTH_FORBIDDEN');
    }

    // Prevent direct status manipulation via update (use approve/reject)
    delete updates.status;
    delete updates.organizerId;
    delete updates.id;

    const updated = eventRepository.update(id, updates);
    auditLogRepository.create({
      action: 'Event Updated',
      actor: user.name,
      target: event.title,
      status: 'Info',
    });

    return updated;
  },

  /**
   * Soft-delete an event.
   */
  deleteEvent(id, user) {
    const event = eventRepository.findById(id);
    if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');

    if (user.role !== 'admin' && event.organizerId !== user.id) {
      throw new AppError('You can only delete your own events', 403, 'AUTH_FORBIDDEN');
    }

    eventRepository.softDelete(id);
    auditLogRepository.create({
      action: 'Event Deleted (Soft)',
      actor: user.name,
      target: event.title,
      status: 'Warning',
    });
  },

  /**
   * Get organizer's own events.
   */
  getOrganizerEvents(organizerId) {
    return eventRepository.findByOrganizer(organizerId);
  },
};
