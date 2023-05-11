const mockPrismaUtils = {
  updateDatabaseSchema: jest.fn(),
  updateModelSchema: jest.fn(),
  buildClient: jest.fn(),
  importClients: jest.fn(),
  getModelName: jest.fn(() => 'User'),
  getClientFolder: jest.fn(() => 'client'),
}

export default mockPrismaUtils
