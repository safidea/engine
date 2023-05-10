import { ObjectUtils, StringUtils } from '@common'

describe('export', () => {
  it('should export ObjectUtils', () => {
    expect(ObjectUtils).toBeDefined()
  })
  it('should export StringUtils', () => {
    expect(StringUtils).toBeDefined()
  })
})
