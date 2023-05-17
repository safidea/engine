import { SchemaUtils } from '../../../src'
import FeatureInterfaceSchema from './feature.interface.json'

describe('constructor', () => {
  it('should create a new instance', () => {
    const schema = new SchemaUtils(FeatureInterfaceSchema as any)
    expect(schema).toBeDefined()
  })
})

describe('validate', () => {
  const schema = new SchemaUtils(FeatureInterfaceSchema as any)

  it('should invalidate the schema', () => {
    try {
      schema.validate({ name: 'test', details: {} })
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.message).toContain("- must have required property 'description'")
      expect(e.message).toContain("- /details must have required property 'id'")
    }
  })

  it('should validate the schema', () => {
    schema.validate({ name: 'test', description: 'test', details: { id: 'test' } })
  })
})
