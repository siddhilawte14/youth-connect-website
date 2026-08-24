import { getStore } from '../config/database.js';

export const userRepository = {
  findAll() {
    return getStore().users;
  },

  findById(id) {
    return getStore().users.find(u => u.id === id) || null;
  },

  findByEmail(email) {
    return getStore().users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findByPrn(prn) {
    return getStore().users.find(u => u.prn && u.prn.toLowerCase() === prn.toLowerCase()) || null;
  },

  /**
   * Find user by email OR PRN (for student login flexibility).
   */
  findByEmailOrPrn(identifier) {
    const lower = identifier.toLowerCase();
    return getStore().users.find(
      u => u.email.toLowerCase() === lower || (u.prn && u.prn.toLowerCase() === lower)
    ) || null;
  },

  create(userData) {
    const user = {
      ...userData,
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    getStore().users.push(user);
    return user;
  },

  update(id, updates) {
    const users = getStore().users;
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    return users[index];
  },
};
