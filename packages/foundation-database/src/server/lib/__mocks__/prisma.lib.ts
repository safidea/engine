const data = { id: '1', name: 'test' }

const mockPrismaLibTable = jest.fn(() => ({
  create: jest.fn(() => data),
  update: jest.fn(() => data),
  upsert: jest.fn(() => data),
  findUnique: jest.fn(() => data),
  delete: jest.fn(() => data),
  findMany: jest.fn(() => [data, { id: '2', name: 'test' }]),
}))

const mockPrismaLib = {
  base: jest.fn(() => ({
    master: mockPrismaLibTable,
  })),
  table: mockPrismaLibTable,
}

export default mockPrismaLib
