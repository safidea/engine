import './setup'
import { TableConfig } from '../../../src'

describe('app with valid config', () => {
  it('should enrich config', () => {
    TableConfig.enrich()
  })

  it('should validate config', () => {
    TableConfig.validate()
  })

  it('should load lib config', () => {
    TableConfig.lib()
  })
})
