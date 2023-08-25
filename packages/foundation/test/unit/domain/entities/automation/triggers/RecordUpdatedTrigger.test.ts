import { RecordUpdatedTriggerMapper } from '@adapter/api/automation/mappers/triggers/RecordUpdatedTriggerMapper'
import { describe, test, expect } from '@jest/globals'

describe('RecordUpdatedTrigger', () => {
  test("should return false if tables doesn't match", async () => {
    // GIVEN
    const trigger = RecordUpdatedTriggerMapper.toEntity({
      event: 'record_updated',
      table: 'invoices_items',
      fields: ['name'],
      filters: [
        {
          field: 'name',
          operator: 'is',
          value: 'test',
        },
      ],
    })
    const usecases = {
      readTableRecord: {
        execute: jest.fn(),
      },
    } as any

    // WHEN
    const result = await trigger.shouldTrigger('record_updated', { table: 'invoices', id: '1' }, usecases)

    // THEN
    expect(result).toBe(false)
    expect(usecases.readTableRecord.execute).not.toHaveBeenCalled()
  })
})
