import { passRepository } from '../repositories/passRepository.js';
import { eventRepository } from '../repositories/eventRepository.js';
import { auditLogRepository } from '../repositories/auditLogRepository.js';
import { AppError } from '../utils/response.js';
import { verifyPassSignature } from '../utils/qrCrypto.js';
import { SCAN_STATUSES } from '../constants/index.js';

export const gateScannerService = {
  /**
   * Verify a ticket code without redeeming it.
   * Returns status: VALID_TICKET, ALREADY_USED, INVALID_TICKET, TICKET_NOT_FOUND, WRONG_EVENT
   */
  verifyTicket(ticketCode, targetEventId = null) {
    // Parse the ticket code (format: ticketId:signature or just ticketId)
    let ticketId, providedSignature;

    if (ticketCode.includes(':')) {
      [ticketId, providedSignature] = ticketCode.split(':');
    } else {
      ticketId = ticketCode;
      providedSignature = null;
    }

    // Look up the pass
    const pass = passRepository.findByTicketId(ticketId);
    if (!pass) {
      return {
        status: SCAN_STATUSES.TICKET_NOT_FOUND,
        message: 'Ticket not found in the system',
        pass: null,
      };
    }

    // Verify HMAC signature if provided
    if (providedSignature) {
      try {
        const isValid = verifyPassSignature(ticketId, pass.eventId, pass.userId, providedSignature);
        if (!isValid) {
          return {
            status: SCAN_STATUSES.INVALID_TICKET,
            message: 'QR code signature verification failed — possible forgery',
            pass: null,
          };
        }
      } catch {
        return {
          status: SCAN_STATUSES.INVALID_TICKET,
          message: 'QR code signature is malformed',
          pass: null,
        };
      }
    }

    // Check if already redeemed
    if (pass.status === 'Redeemed') {
      return {
        status: SCAN_STATUSES.ALREADY_USED,
        message: 'This ticket has already been used for entry',
        pass: {
          ticketId: pass.ticketId,
          attendeeName: pass.attendeeName,
          eventTitle: pass.eventTitle,
          redeemedAt: pass.redeemedAt,
        },
      };
    }

    // Check wrong event
    if (targetEventId && pass.eventId !== targetEventId) {
      const correctEvent = eventRepository.findById(pass.eventId);
      return {
        status: SCAN_STATUSES.WRONG_EVENT,
        message: `This ticket is for "${correctEvent?.title || pass.eventTitle}", not the current event`,
        pass: {
          ticketId: pass.ticketId,
          attendeeName: pass.attendeeName,
          eventTitle: pass.eventTitle,
          correctEventId: pass.eventId,
        },
      };
    }

    // Valid ticket
    return {
      status: SCAN_STATUSES.VALID_TICKET,
      message: 'Valid ticket — ready for entry',
      pass: {
        ticketId: pass.ticketId,
        attendeeName: pass.attendeeName,
        eventTitle: pass.eventTitle,
        venue: pass.venue,
        tier: pass.tier,
        collegeId: pass.collegeId,
        department: pass.department,
        teamName: pass.teamName,
      },
    };
  },

  /**
   * Redeem a ticket — marks it as used. Called after verify returns VALID_TICKET.
   */
  redeemTicket(ticketCode, user) {
    let ticketId;
    if (ticketCode.includes(':')) {
      [ticketId] = ticketCode.split(':');
    } else {
      ticketId = ticketCode;
    }

    const pass = passRepository.findByTicketId(ticketId);
    if (!pass) {
      throw new AppError('Ticket not found', 404, 'TICKET_NOT_FOUND');
    }

    if (pass.status === 'Redeemed') {
      throw new AppError('Ticket already redeemed', 409, 'PASS_ALREADY_REDEEMED');
    }

    passRepository.updateStatus(ticketId, 'Redeemed');
    passRepository.update(ticketId, { redeemedAt: new Date().toISOString() });

    auditLogRepository.create({
      action: 'QR Ticket Redeemed',
      actor: user.name,
      target: `Ticket ${ticketId} (${pass.attendeeName})`,
      status: 'Info',
    });

    return {
      status: SCAN_STATUSES.ENTRY_CONFIRMED,
      message: 'Entry confirmed successfully',
      pass: {
        ticketId: pass.ticketId,
        attendeeName: pass.attendeeName,
        eventTitle: pass.eventTitle,
      },
    };
  },
};
