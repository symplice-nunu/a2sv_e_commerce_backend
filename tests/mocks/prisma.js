"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMockPrisma = exports.mockPrisma = void 0;
const globals_1 = require("@jest/globals");
exports.mockPrisma = {
    user: {
        findUnique: globals_1.jest.fn(),
        create: globals_1.jest.fn(),
    },
    product: {
        create: globals_1.jest.fn(),
        findUnique: globals_1.jest.fn(),
        update: globals_1.jest.fn(),
        delete: globals_1.jest.fn(),
        findMany: globals_1.jest.fn(),
        count: globals_1.jest.fn(),
    },
    order: {
        create: globals_1.jest.fn(),
        findMany: globals_1.jest.fn(),
    },
    orderItem: {
        create: globals_1.jest.fn(),
    },
    $transaction: globals_1.jest.fn(),
};
const setTransactionImplementation = () => {
    exports.mockPrisma.$transaction.mockImplementation(async (callback) => callback(exports.mockPrisma));
};
setTransactionImplementation();
const resetMockPrisma = () => {
    Object.values(exports.mockPrisma).forEach((model) => {
        if (typeof model === "object" && model !== null) {
            Object.values(model).forEach((method) => {
                if (typeof method === "function" && "mockReset" in method) {
                    method.mockReset();
                }
            });
        }
    });
    setTransactionImplementation();
};
exports.resetMockPrisma = resetMockPrisma;
//# sourceMappingURL=prisma.js.map