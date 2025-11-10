"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const errors_1 = require("../common/errors");
const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    });
    if (!result.success) {
        const errors = result.error.issues.map((issue) => issue.message);
        throw (0, errors_1.badRequest)("Validation failed", errors);
    }
    const { body, query, params } = result.data;
    if (body !== undefined) {
        req.body = body;
    }
    if (query !== undefined) {
        req.query = query;
    }
    if (params !== undefined) {
        req.params = params;
    }
    return next();
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map