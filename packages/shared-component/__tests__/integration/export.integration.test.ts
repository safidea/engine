import { ComponentSchema } from '../../src'

test('should export ComponentSchema', () => {
  expect(ComponentSchema).toBeDefined()
  expect(ComponentSchema).toHaveProperty('$schema')
})
