import { broadcastRepository } from '../repositories/broadcastRepository.js';
import { eventRepository } from '../repositories/eventRepository.js';
import { passRepository } from '../repositories/passRepository.js';
import { auditLogRepository } from '../repositories/auditLogRepository.js';
import { AppError } from '../utils/response.js';

export const broadcastService = {
  /**
   * Send a broadcast message to all attendees of an event.
   * Only the event organizer or admin can send broadcasts.
   */
  sendBroadcast({ eventId, subject, message, channel = 'in-app' }, user) {
    const event = eventRepository.findById(eventId);
    if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');

    // Object-level authorization
    if (user.role !== 'admin' && event.organizerId !== user.id) {
      throw new AppError('You can only send broadcasts for your own events', 403, 'AUTH_FORBIDDEN');
    }

    // Get recipients (all pass holders for this event)
    const passes = passRepository.findByEventId(eventId);
    const recipientCount = passes.length;

    const broadcast = broadcastRepository.create({
      eventId,
      eventTitle: event.title,
      senderId: user.id,
      senderName: user.name,
      subject,
      message,
      channel,
      recipientCount,
    });

    auditLogRepository.create({
      action: 'Broadcast Sent',
      actor: user.name,
      target: `${event.title} (${recipientCount} recipients)`,
      status: 'Success',
    });

    return broadcast;
  },

  /**
   * Get all broadcasts for an event.
   */
  getEventBroadcasts(eventId, user) {
    const event = eventRepository.findById(eventId);
    if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');

    if (user.role !== 'admin' && event.organizerId !== user.id) {
      throw new AppError('Access denied', 403, 'AUTH_FORBIDDEN');
    }

    return broadcastRepository.findByEventId(eventId);
  },
};
