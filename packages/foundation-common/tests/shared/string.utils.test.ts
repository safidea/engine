import { StringUtils } from '@shared'

test('should capitalize a word', () => {
  expect(StringUtils.capitalize('hello')).toBe('Hello')
})

test('should get singular of a plurial word', () => {
  expect(StringUtils.singular('hellos')).toBe('hello')
})

test('should get singular of a word', () => {
  expect(StringUtils.singular('hello')).toBe('hello')
})

test('should check a json string', () => {
  expect(StringUtils.isJSON('{"hello": "world"}')).toBe(true)
})

test('should check a non-json string', () => {
  expect(StringUtils.isJSON('hello world')).toBe(false)
})
