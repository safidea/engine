import './setup'
import { DatabaseConfig } from '../../../src'

describe('config app with no databases', () => {
  it('should enrich config', () => {
    DatabaseConfig.enrich()
  })

  it('should validate config', () => {
    DatabaseConfig.validate()
  })

  it('should load lib config', () => {
    DatabaseConfig.lib()
  })

  it('should build js config', () => {
    DatabaseConfig.js()
  })
})
