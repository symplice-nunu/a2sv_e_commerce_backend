"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../common/errors");
const response_1 = require("../common/response");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, req, res, next) => {
    if (err instanceof errors_1.AppError) {
        return (0, response_1.sendResponse)(res, err.statusCode, err.message, null, err.errors);
    }
    console.error(err);
    return (0, response_1.sendResponse)(res, 500, "Internal server error", null, ["Internal server error"]);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map