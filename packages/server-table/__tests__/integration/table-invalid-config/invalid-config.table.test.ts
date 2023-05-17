import './setup'
import { TableConfig } from '../../../src'

describe('app with not valid tables schema', () => {
  it('should enrich config', () => {
    TableConfig.enrich()
  })

  it('should invalidate config', () => {
    try {
      TableConfig.validate()
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.message).toContain("must have required property 'database'")
    }
  })
})
