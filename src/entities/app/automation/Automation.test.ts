import { describe, test, expect } from '@jest/globals'
import { TableMapper } from '@adapters/api/table/mappers/TableMapper'
import { AutomationMapper } from '@adapters/api/automation/mappers/AutomationMapper'
import { HandlebarsTemplating } from '@drivers/templater/handlebars/HandlebarsTemplater'

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
        actions: [
          {
            name: 'update-record',
            type: 'update_record',
            fields: { fieldA: 'test' },
            table: 'tableA',
            recordId: '1',
          },
        ],
      },
      tables,
      {
        templating: new HandlebarsTemplating(),
      }
    )

    // WHEN
    const shouldTrigger = await automation.shouldTrigger(
      'record_created',
      { table: 'tableA' },
      {} as any
    )

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
        actions: [
          {
            name: 'update-record',
            type: 'update_record',
            fields: { fieldA: 'test' },
            table: 'tableA',
            recordId: '1',
          },
        ],
      },
      tables,
      {
        templating: new HandlebarsTemplating(),
      }
    )

    // WHEN
    const shouldTrigger = await automation.shouldTrigger(
      'record_updated',
      { table: 'tableA' },
      {} as any
    )

    // THEN
    expect(shouldTrigger).toBe(false)
  })
})
