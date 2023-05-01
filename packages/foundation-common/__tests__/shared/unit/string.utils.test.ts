import { StringUtils } from '@common'

describe('isJSON', () => {
  it('should check a non-json string', () => {
    expect(StringUtils.isJSON('hello world')).toBe(false)
  })

  it('should check a json string', () => {
    expect(StringUtils.isJSON('{"hello": "world"}')).toBe(true)
  })
})

describe('capitalize', () => {
  it('should capitalize a word', () => {
    expect(StringUtils.capitalize('hello')).toBe('Hello')
  })
})

describe('singular', () => {
  it('should get singular of a plurial word', () => {
    expect(StringUtils.singular('hellos')).toBe('hello')
  })

  it('should get singular of a word', () => {
    expect(StringUtils.singular('hello')).toBe('hello')
  })
})
