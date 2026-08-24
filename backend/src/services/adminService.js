import { eventRepository } from '../repositories/eventRepository.js';
import { clubRepository } from '../repositories/communityRepository.js';
import { auditLogRepository } from '../repositories/auditLogRepository.js';
import { passRepository } from '../repositories/passRepository.js';
import { AppError } from '../utils/response.js';

export const adminService = {
  /**
   * Approve an event (change status from Draft/Pending to Published).
   */
  approveEvent(eventId, user) {
    const event = eventRepository.findByIdIncludeDeleted(eventId);
    if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');

    eventRepository.update(eventId, { status: 'Published' });

    auditLogRepository.create({
      action: 'Event Approved',
      actor: user.name,
      target: event.title,
      status: 'Success',
    });

    return eventRepository.findByIdIncludeDeleted(eventId);
  },

  /**
   * Reject an event.
   */
  rejectEvent(eventId, reason, user) {
    const event = eventRepository.findByIdIncludeDeleted(eventId);
    if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');

    eventRepository.update(eventId, { status: 'Cancelled', rejectionReason: reason });

    auditLogRepository.create({
      action: 'Event Rejected',
      actor: user.name,
      target: `${event.title} — Reason: ${reason}`,
      status: 'Warning',
    });

    return eventRepository.findByIdIncludeDeleted(eventId);
  },

  /**
   * Toggle club verification badge.
   */
  toggleClubVerification(clubId, user) {
    const club = clubRepository.findById(clubId);
    if (!club) throw new AppError('Club not found', 404, 'NOT_FOUND');

    const updated = clubRepository.update(clubId, { isVerified: !club.isVerified });

    auditLogRepository.create({
      action: updated.isVerified ? 'Club Verified' : 'Club Verification Revoked',
      actor: user.name,
      target: club.name,
      status: updated.isVerified ? 'Success' : 'Warning',
    });

    return updated;
  },

  /**
   * Get audit logs with pagination.
   */
  getAuditLogs({ limit = 50, offset = 0 } = {}) {
    const logs = auditLogRepository.findAll({ limit, offset });
    const total = auditLogRepository.count();
    return { logs, total, limit, offset };
  },

  /**
   * Get platform-wide statistics for admin dashboard.
   */
  getDashboardStats() {
    const events = eventRepository.findAll({ excludeDeleted: true });
    const allPasses = passRepository.findAll();
    const clubs = clubRepository.findAll();

    const totalEvents = events.length;
    const publishedEvents = events.filter(e => e.status === 'Published').length;
    const draftEvents = events.filter(e => e.status === 'Draft' || e.status === 'Pending Approval').length;
    const totalRegistrations = allPasses.length;
    const redeemedPasses = allPasses.filter(p => p.status === 'Redeemed').length;
    const totalRevenue = allPasses.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    const totalClubs = clubs.length;
    const verifiedClubs = clubs.filter(c => c.isVerified).length;

    return {
      totalEvents, publishedEvents, draftEvents,
      totalRegistrations, redeemedPasses,
      totalRevenue, totalClubs, verifiedClubs,
    };
  },
};
