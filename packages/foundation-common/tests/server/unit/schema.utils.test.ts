import { join } from 'path'
import { SchemaUtils } from '@common/server'

describe('validate schema from type', () => {
  const path = join(__dirname, '..', 'feature.interface.ts')

  it('should invalidate the schema', () => {
    try {
      SchemaUtils.validateFromType(
        { name: 'test', details: {} },
        { path, type: 'FeatureInterface', name: 'Feature' }
      )
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.message).toContain("- Feature must have required property 'description'")
      expect(e.message).toContain("- Feature must have required property 'id' at /details")
    }
  })

  it('should validate the schema', () => {
    SchemaUtils.validateFromType(
      { name: 'test', description: 'test', details: { id: 'test' } },
      { path, type: 'FeatureInterface', name: 'Feature' }
    )
    expect(true).toBe(true)
  })
})
