import './setup'
import { TableConfig } from '../../../src'

describe('app with not valid database', () => {
  it('should enrich config', () => {
    TableConfig.enrich()
  })

  it('should invalidate database of table master', () => {
    try {
      TableConfig.validate()
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.message).toContain('Database "master" is not found for table "users"')
    }
  })
})
