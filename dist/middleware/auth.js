"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const errors_1 = require("../common/errors");
const jwt_1 = require("../utils/jwt");
const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        throw (0, errors_1.unauthorized)("Authentication token missing");
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const payload = (0, jwt_1.verifyJwt)(token);
        req.user = {
            userId: payload.userId,
            username: payload.username,
            role: payload.role,
        };
        return next();
    }
    catch {
        throw (0, errors_1.unauthorized)("Invalid or expired token");
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw (0, errors_1.unauthorized)("Authentication required");
        }
        if (!roles.includes(req.user.role)) {
            throw (0, errors_1.forbidden)("You do not have permission to perform this action");
        }
        return next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map