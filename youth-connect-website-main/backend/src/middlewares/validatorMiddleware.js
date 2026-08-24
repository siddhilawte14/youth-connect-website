import { errorResponse } from '../utils/response.js';

/**
 * Creates a validation middleware from a schema definition object.
 * Schema format: { fieldName: { required, type, min, max, enum, pattern, message } }
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const data = req[source];
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data?.[field];

      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: rules.message || `${field} is required` });
        continue;
      }

      // Skip further validation if field is optional and not provided
      if (value === undefined || value === null || value === '') continue;

      // Type check
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push({ field, message: `${field} must be a string` });
      } else if (rules.type === 'number' && typeof value !== 'number') {
        errors.push({ field, message: `${field} must be a number` });
      } else if (rules.type === 'object' && typeof value !== 'object') {
        errors.push({ field, message: `${field} must be an object` });
      }

      // String length
      if (typeof value === 'string') {
        if (rules.min && value.length < rules.min) {
          errors.push({ field, message: `${field} must be at least ${rules.min} characters` });
        }
        if (rules.max && value.length > rules.max) {
          errors.push({ field, message: `${field} must be at most ${rules.max} characters` });
        }
      }

      // Number range
      if (typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push({ field, message: `${field} must be at least ${rules.min}` });
        }
      }

      // Enum check
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({ field, message: `${field} must be one of: ${rules.enum.join(', ')}` });
      }

      // Pattern check
      if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        errors.push({ field, message: rules.message || `${field} has invalid format` });
      }
    }

    if (errors.length > 0) {
      return errorResponse(res, 'Validation failed', 400, 'VALIDATION_ERROR', errors);
    }

    next();
  };
}
