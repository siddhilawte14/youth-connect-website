import { gateScannerService } from '../services/gateScannerService.js';
import { successResponse } from '../utils/response.js';

export const gateScannerController = {
  verifyTicket(req, res, next) {
    try {
      const { ticketCode, targetEventId } = req.body;
      const result = gateScannerService.verifyTicket(ticketCode, targetEventId || null);
      return successResponse(res, result, result.message);
    } catch (err) { next(err); }
  },

  redeemTicket(req, res, next) {
    try {
      const { ticketCode } = req.body;
      const result = gateScannerService.redeemTicket(ticketCode, req.user);
      return successResponse(res, result, result.message);
    } catch (err) { next(err); }
  },
};
