import { ObjectUtils, StringUtils } from '@common'

describe('export', () => {
  it('should export SchemaUtils', () => {
    expect(ObjectUtils).toBeDefined()
  })
  it('should export PathUtils', () => {
    expect(StringUtils).toBeDefined()
  })
})
