import { describe, test, expect } from 'bun:test'
import { TableValidator } from './TableValidator'
import { App } from '@entities/app/App'

describe('TableValidator', () => {
  describe('validateRecordBody', () => {
    test('should validate the request body', async () => {
      // GIVEN
      const tableValidator = new TableValidator({} as App)

      // WHEN
      const record = await tableValidator.validateRecordBody({
        fieldA: 'valueA',
      })

      // THEN
      expect(record.fieldA).toBe('valueA')
    })
  })
})
