import { SchemaUtils } from '@common/server'
import FeatureInterfaceSchema from '../feature.interface.json'

describe('validate schema from type', () => {
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
    expect(true).toBe(true)
  })
})
