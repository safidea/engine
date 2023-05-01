const mockDatabaseService = {
  baseExist: jest.fn(() => true),
  tableExist: jest.fn(() => true),
  readById: jest.fn(() => ({ id: '1', name: 'test' })),
}

export default mockDatabaseService
