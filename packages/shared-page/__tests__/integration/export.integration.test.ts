import { PageSchema } from '../../src'

test('should export PageSchema', () => {
  expect(PageSchema).toBeDefined()
  expect(PageSchema).toHaveProperty('$schema')
})
