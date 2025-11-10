"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaginatedResponse = exports.sendResponse = void 0;
const sendResponse = (res, statusCode, message, data, errors = null) => {
    const payload = {
        success: statusCode >= 200 && statusCode < 400,
        message,
        object: data,
        errors,
    };
    return res.status(statusCode).json(payload);
};
exports.sendResponse = sendResponse;
const sendPaginatedResponse = (res, statusCode, message, data, pageNumber, pageSize, totalSize, errors = null) => {
    const payload = {
        success: statusCode >= 200 && statusCode < 400,
        message,
        object: data,
        pageNumber,
        pageSize,
        totalSize,
        errors,
    };
    return res.status(statusCode).json(payload);
};
exports.sendPaginatedResponse = sendPaginatedResponse;
//# sourceMappingURL=response.js.map