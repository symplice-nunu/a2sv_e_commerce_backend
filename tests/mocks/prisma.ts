import { jest } from "@jest/globals";

export const mockPrisma: any = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  product: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  orderItem: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

const setTransactionImplementation = () => {
  mockPrisma.$transaction.mockImplementation(
    async (callback: (tx: typeof mockPrisma) => Promise<unknown>) =>
      callback(mockPrisma as never),
  );
};

setTransactionImplementation();

export const resetMockPrisma = () => {
  Object.values(mockPrisma).forEach((model) => {
    if (typeof model === "object" && model !== null) {
      Object.values(model).forEach((method) => {
        if (typeof method === "function" && "mockReset" in method) {
          (method as jest.Mock).mockReset();
        }
      });
    }
  });

  setTransactionImplementation();
};

