import './setup'
import { ComponentConfig } from '../../../src'

describe('config app with components', () => {
  it('should enrich config', () => {
    ComponentConfig.enrich()
  })

  it('should validate config', () => {
    ComponentConfig.validate()
  })

  it('should load lib config', () => {
    ComponentConfig.lib()
  })

  it('should build js config', () => {
    ComponentConfig.js()
  })
})
