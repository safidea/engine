const base = {
  lib: {},
  PrismaClients: {
    master: {
      PrismaClient: class PrismaClient {
        user = {
          findMany: jest.fn(),
          findOne: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        }
      },
    },
  },
}

export { base }
