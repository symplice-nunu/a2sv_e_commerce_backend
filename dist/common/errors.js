"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.forbidden = exports.unauthorized = exports.badRequest = exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, errors = null, message) {
        super(message ?? "Application error");
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
const badRequest = (message, errors) => new AppError(400, errors ?? [message], message);
exports.badRequest = badRequest;
const unauthorized = (message = "Unauthorized") => new AppError(401, [message], message);
exports.unauthorized = unauthorized;
const forbidden = (message = "Forbidden") => new AppError(403, [message], message);
exports.forbidden = forbidden;
const notFound = (message = "Not found") => new AppError(404, [message], message);
exports.notFound = notFound;
//# sourceMappingURL=errors.js.map