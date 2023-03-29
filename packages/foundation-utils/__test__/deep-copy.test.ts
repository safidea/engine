import { deepCopy } from '../src'

test('should make a deep copy', async () => {
  const obj = { a: 1, b: 2 }
  const copy = deepCopy(obj)
  expect(copy).toEqual(obj)
  expect(copy).not.toBe(obj)
})
