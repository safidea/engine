const lib = {}
const PrismaClients = {
  master: {
    PrismaClient: class PrismaClient {
      user = {
        findMany: jest.fn(() => [
          { id: '1', name: 'test' },
          { id: '2', name: 'test' },
        ]),
        findUnique: jest.fn(({ where: { id } }) => (id === '1' ? { id: '1', name: 'test' } : null)),
        create: jest.fn(() => ({ id: '1', name: 'test' })),
        update: jest.fn(() => ({ id: '1', name: 'test' })),
        upsert: jest.fn(() => ({ id: '1', name: 'test' })),
        delete: jest.fn(() => ({ id: '1', name: 'test' })),
      }
    },
  },
}

export { lib, PrismaClients }
