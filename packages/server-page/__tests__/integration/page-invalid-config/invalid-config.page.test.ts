import './setup'
import { PageConfig } from '../../../src'

describe('app with not valid tables schema', () => {
  it('should enrich config', () => {
    PageConfig.enrich()
  })

  it('should invalidate config', () => {
    try {
      PageConfig.validate()
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.message).toContain("must have required property 'body'")
    }
  })
})
