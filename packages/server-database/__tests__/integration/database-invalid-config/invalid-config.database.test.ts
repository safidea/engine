import './setup'
import { DatabaseConfig } from '../../../src'

describe('config app with not valid databases schema', () => {
  it('should enrich config', () => {
    DatabaseConfig.enrich()
  })

  it('should invalidate config', () => {
    try {
      DatabaseConfig.validate()
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.message).toContain("must have required property 'url'")
    }
  })
})
