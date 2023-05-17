import './setup'
import { PageConfig } from '../../../src'

describe('app with valid config', () => {
  it('should enrich config', () => {
    PageConfig.enrich()
  })

  it('should validate config', () => {
    PageConfig.validate()
  })

  it('should load lib config', () => {
    PageConfig.lib()
  })
})
