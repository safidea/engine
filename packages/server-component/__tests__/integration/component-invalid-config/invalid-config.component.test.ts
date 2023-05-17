import './setup'
import { ComponentConfig } from '../../../src'

describe('config app with not valid component schema', () => {
  it('should enrich config', () => {
    ComponentConfig.enrich()
  })

  it('should invalidate config', () => {
    try {
      ComponentConfig.validate()
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.message).toContain('must be object')
    }
  })
})
