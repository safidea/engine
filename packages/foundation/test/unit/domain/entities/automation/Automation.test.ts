import { describe, test, expect } from '@jest/globals'
import { TableMapper } from '@adapter/api/table/mappers/TableMapper'
import { AutomationMapper } from '@adapter/api/automation/mappers/AutomationMapper'

describe('Automation', () => {
  test('should return true if trigger event is called', async () => {
    // GIVEN
    const tables = TableMapper.toEntities([
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'single_line_text',
          },
        ],
      },
    ])
    const automation = AutomationMapper.toEntity(
      {
        name: 'updateRecord',
        trigger: { event: 'record_created', table: 'tableA' },
        actions: [{ type: 'update_record', fields: { fieldA: 'test' }, table: 'tableA' }],
      },
      tables,
      {} as any
    )

    // WHEN
    const shouldTrigger = automation.shouldTrigger('record_created')

    // THEN
    expect(shouldTrigger).toBe(true)
  })

  test('should return false if trigger event is not called', async () => {
    // GIVEN
    const tables = TableMapper.toEntities([
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'single_line_text',
          },
        ],
      },
    ])
    const automation = AutomationMapper.toEntity(
      {
        name: 'updateRecord',
        trigger: { event: 'record_created', table: 'tableA' },
        actions: [{ type: 'update_record', fields: { fieldA: 'test' }, table: 'tableA' }],
      },
      tables,
      {} as any
    )

    // WHEN
    const shouldTrigger = automation.shouldTrigger('record_updated')

    // THEN
    expect(shouldTrigger).toBe(false)
  })
})
