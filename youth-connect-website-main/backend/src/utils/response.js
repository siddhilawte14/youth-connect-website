export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function successResponse(res, data = null, message = 'Success', statusCode = 200) {
  const response = { success: true, message };
  if (data !== null && data !== undefined) response.data = data;
  return res.status(statusCode).json(response);
}

export function errorResponse(res, message = 'Internal server error', statusCode = 500, code = 'INTERNAL_ERROR', errors = []) {
  const response = { success: false, code, message };
  if (errors.length > 0) response.errors = errors;
  return res.status(statusCode).json(response);
}

export function createdResponse(res, data, message = 'Created successfully') {
  return successResponse(res, data, message, 201);
}
