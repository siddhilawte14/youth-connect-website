import { getStore } from '../config/database.js';
import { sha256Hash } from '../utils/qrCrypto.js';

export const auditLogRepository = {
  findAll({ limit = 50, offset = 0 } = {}) {
    const logs = getStore().auditLogs;
    return logs.slice(offset, offset + limit);
  },

  count() {
    return getStore().auditLogs.length;
  },

  create({ action, actor, target, status = 'Info' }) {
    const id = `aud-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const hash = sha256Hash({ id, action, actor, target, timestamp });

    const entry = { id, action, actor, target, timestamp, status, hash };
    getStore().auditLogs.push(entry);
    return entry;
  },
};
