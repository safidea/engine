import { TableSchema } from '../../src'

test('should export TableSchema', () => {
  expect(TableSchema).toBeDefined()
  expect(TableSchema).toHaveProperty('$schema')
})
