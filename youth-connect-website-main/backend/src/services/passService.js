import { passRepository } from '../repositories/passRepository.js';
import { eventRepository } from '../repositories/eventRepository.js';
import { auditLogRepository } from '../repositories/auditLogRepository.js';
import { AppError } from '../utils/response.js';
import { signPass, generateTicketId } from '../utils/qrCrypto.js';

export const passService = {
  /**
   * Register for an event and generate a digital pass with HMAC-signed QR.
   */
  registerForEvent({ eventId, fullName, collegeId, department, teamName, amountPaid }, user) {
    const event = eventRepository.findById(eventId);
    if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      throw new AppError('Event has reached maximum capacity', 409, 'CAPACITY_FULL');
    }

    // Check duplicate registration
    const existing = passRepository.findByUserAndEvent(user.id, eventId);
    if (existing) {
      throw new AppError('You are already registered for this event', 409, 'DUPLICATE_ENTRY');
    }

    // Generate ticket
    const categoryHint = event.category ? event.category.substring(0, 3) : 'GEN';
    const ticketId = generateTicketId(categoryHint);
    const qrSignature = signPass(ticketId, eventId, user.id);

    const pass = passRepository.create({
      ticketId,
      eventId,
      eventTitle: event.title,
      venue: event.venue,
      date: event.date?.fullDate || '',
      time: event.date?.time || '',
      tier: amountPaid > 0 ? 'VIP ACCESS' : 'STANDARD PASS',
      userId: user.id,
      attendeeName: fullName,
      collegeId,
      department,
      teamName: teamName || null,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}:${qrSignature}`,
      qrSignature,
      status: 'Valid',
      amountPaid: amountPaid || 0,
      issuedAt: new Date().toISOString(),
    });

    // Increment event registration count
    eventRepository.incrementRegistration(eventId);

    auditLogRepository.create({
      action: 'Pass Issued',
      actor: fullName,
      target: `${ticketId} for ${event.title}`,
      status: 'Success',
    });

    return pass;
  },

  /**
   * Get all passes for the authenticated user.
   */
  getMyPasses(userId) {
    return passRepository.findByUserId(userId);
  },

  /**
   * Get a specific pass by ticket ID (for the authenticated user).
   */
  getPassByTicketId(ticketId, userId) {
    const pass = passRepository.findByTicketId(ticketId);
    if (!pass) throw new AppError('Pass not found', 404, 'NOT_FOUND');
    if (pass.userId !== userId) throw new AppError('Access denied', 403, 'AUTH_FORBIDDEN');
    return pass;
  },

  /**
   * Get all attendees (passes) for a specific event. Organizer/admin only.
   */
  getEventAttendees(eventId, user) {
    const event = eventRepository.findById(eventId);
    if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');

    if (user.role !== 'admin' && event.organizerId !== user.id) {
      throw new AppError('You can only view attendees for your own events', 403, 'AUTH_FORBIDDEN');
    }

    return passRepository.findByEventId(eventId);
  },
};
