import { describe, test, expect } from '@jest/globals'
import { TableValidator } from './TableValidator'
import { App } from '@entities/app/App'

describe('TableValidator', () => {
  describe('validateRecordBody', () => {
    test('should validate the request body', async () => {
      // GIVEN
      const tableValidator = new TableValidator({} as App)

      // WHEN
      const call = () =>
        tableValidator.validateRecordBody({
          fieldA: 'valueA',
        })

      // THEN
      await expect(call()).resolves.not.toThrow()
    })
  })
})
