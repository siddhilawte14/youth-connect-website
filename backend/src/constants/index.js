export const ROLES = {
  STUDENT: 'student',
  ORGANIZER: 'organizer',
  TENANT_ADMIN: 'tenant_admin',
  ADMIN: 'admin',
};

export const EVENT_CATEGORIES = [
  'Hackathon', 'Technology', 'Workshop', 'Cultural', 'Competitions',
  'Fests', 'Sports', 'Entrepreneurship', 'Volunteering', 'NGO Drives',
  'Career', 'Academic', 'Meetup', 'Other',
];

export const EVENT_STATUSES = ['Published', 'Draft', 'Completed', 'Cancelled', 'Pending Approval', 'Filling Fast'];

export const PASS_STATUSES = ['Valid', 'Redeemed', 'Cancelled'];

export const AREAS = ['Panchavati', 'Gangapur Road', 'Sandip Foundation', 'City Center', 'College Road', 'Online'];

export const SCAN_STATUSES = {
  VALID_TICKET: 'VALID_TICKET',
  ENTRY_CONFIRMED: 'ENTRY_CONFIRMED',
  ALREADY_USED: 'ALREADY_USED',
  INVALID_TICKET: 'INVALID_TICKET',
  TICKET_NOT_FOUND: 'TICKET_NOT_FOUND',
  WRONG_EVENT: 'WRONG_EVENT',
};
