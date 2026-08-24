import { userRepository } from '../repositories/userRepository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../utils/response.js';
import { auditLogRepository } from '../repositories/auditLogRepository.js';

/**
 * Formats user object for API response (strips sensitive fields).
 */
function formatUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

export const authService = {
  /**
   * Student login: accepts email OR PRN + password.
   */
  async loginStudent(emailOrPrn, password) {
    const user = userRepository.findByEmailOrPrn(emailOrPrn);
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'AUTH_INVALID_CREDENTIALS');
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401, 'AUTH_INVALID_CREDENTIALS');
    }

    const token = signToken({ id: user.id, role: user.role, email: user.email });
    auditLogRepository.create({ action: 'Student Login', actor: user.name, target: user.email, status: 'Success' });

    return { token, user: formatUser(user) };
  },

  /**
   * Organizer login: requires email (rejects student PRN format).
   */
  async loginOrganizer(email, password) {
    // Reject student-format emails (e.g. 21bce045@kkwieer.edu.in)
    if (/^\d{2}[a-zA-Z]{3}\d{3}@/i.test(email)) {
      throw new AppError('Student accounts cannot access organizer login. Use the student login instead.', 403, 'AUTH_FORBIDDEN');
    }

    const user = userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'AUTH_INVALID_CREDENTIALS');
    }

    if (user.role !== 'organizer' && user.role !== 'admin') {
      throw new AppError('This login is for organizers only', 403, 'AUTH_FORBIDDEN');
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401, 'AUTH_INVALID_CREDENTIALS');
    }

    const token = signToken({ id: user.id, role: user.role, email: user.email });
    auditLogRepository.create({ action: 'Organizer Login', actor: user.name, target: user.email, status: 'Success' });

    return { token, user: formatUser(user) };
  },

  /**
   * Register a new user.
   */
  async register({ name, email, password, role = 'student', college, department, prn }) {
    // Check duplicate email
    const existing = userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('An account with this email already exists', 409, 'DUPLICATE_ENTRY');
    }

    // Check duplicate PRN
    if (prn) {
      const existingPrn = userRepository.findByPrn(prn);
      if (existingPrn) {
        throw new AppError('An account with this PRN already exists', 409, 'DUPLICATE_ENTRY');
      }
    }

    const passwordHash = await hashPassword(password);
    const user = userRepository.create({
      name, email, passwordHash, role, college, department, prn,
    });

    const token = signToken({ id: user.id, role: user.role, email: user.email });
    auditLogRepository.create({ action: 'User Registered', actor: name, target: email, status: 'Success' });

    return { token, user: formatUser(user) };
  },

  /**
   * Get current user profile.
   */
  getProfile(userId) {
    const user = userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
    return formatUser(user);
  },
};
