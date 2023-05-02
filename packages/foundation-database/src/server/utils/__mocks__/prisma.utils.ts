const mockPrismaUtils = {
  updateDatabaseSchema: jest.fn(),
  updateModelSchema: jest.fn(),
  buildClient: jest.fn(),
  buildIndexClients: jest.fn(),
  getModelName: jest.fn(() => 'User'),
  getClientFolder: jest.fn(() => 'client'),
}

export default mockPrismaUtils
