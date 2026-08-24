# Validation Rules

## Auth - Student Login
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `emailOrPrn` | string | Yes | Min 3 chars |
| `password` | string | Yes | Min 6 chars |
| `name` | string | No | Max 100 chars |
| `college` | string | No | Max 200 chars |

## Auth - Organizer Login
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Min 6 chars |

## Auth - Register
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | Yes | Min 2, Max 100 chars |
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Min 6 chars |
| `role` | string | Yes | Enum: `student`, `organizer` |
| `college` | string | No | Max 200 chars |
| `department` | string | No | Max 100 chars |
| `prn` | string | No | Max 20 chars |

## Event Creation
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `title` | string | Yes | Min 3, Max 200 chars |
| `category` | string | Yes | Valid EventCategory enum |
| `description` | string | Yes | Min 10, Max 5000 chars |
| `venue` | string | Yes | Max 300 chars |
| `area` | string | Yes | Max 100 chars |
| `fee` | number | Yes | Min 0 |
| `capacity` | number | Yes | Min 1 |
| `date` | object | Yes | Must have month, day, fullDate, time |
| `status` | string | No | Enum: `Published`, `Draft`, `Pending Approval` |

## Pass Registration
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `eventId` | string | Yes | Must exist in events |
| `fullName` | string | Yes | Min 2, Max 100 chars |
| `collegeId` | string | Yes | Min 2, Max 20 chars |
| `department` | string | Yes | Max 100 chars |
| `teamName` | string | No | Max 100 chars |
| `amountPaid` | number | Yes | Min 0 |

## Gate Scanner
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `ticketCode` | string | Yes | Non-empty |
| `targetEventId` | string | No | If provided, must match pass event |
