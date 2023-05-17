import { DatabaseSchema } from '../../src'

test('should export DatabaseSchema', () => {
  expect(DatabaseSchema).toBeDefined()
  expect(DatabaseSchema).toHaveProperty('$schema')
})
