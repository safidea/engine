import { describe, test, expect, mock } from 'bun:test'
import { TableList } from '../table/TableList'
import { Automation } from './Automation'

describe('Automation', () => {
  test('should return true if trigger event is called', async () => {
    // GIVEN
    const tables = new TableList(
      [
        {
          name: 'tableA',
          fields: [
            {
              name: 'fieldA',
              type: 'single_line_text',
            },
          ],
        },
      ],
      {
        database: {} as any,
      } as any
    )
    const templater = {
      compile: mock((value) => ({
        render: mock(() => value),
      })),
    } as any
    const automation = new Automation(
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
      { templater } as any,
      { tables } as any
    )

    // WHEN
    const shouldTrigger = await automation.shouldTrigger({
      event: 'record_created',
      context: { table: 'tableA', record: { id: '1' } },
    })

    // THEN
    expect(shouldTrigger).toBe(true)
  })

  test('should return false if trigger event is not called', async () => {
    // GIVEN
    const tables = new TableList(
      [
        {
          name: 'tableA',
          fields: [
            {
              name: 'fieldA',
              type: 'single_line_text',
            },
          ],
        },
      ],
      {
        database: {} as any,
      } as any
    )
    const templater = {
      compile: mock((value) => ({
        render: mock(() => value),
      })),
    } as any
    const automation = new Automation(
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
      {
        templater,
      } as any,
      { tables } as any
    )

    // WHEN
    const shouldTrigger = await automation.shouldTrigger({
      event: 'record_updated',
      context: {
        table: 'tableA',
        record: { id: '1', name: 'test' },
        updatedFields: ['name'],
      },
    })

    // THEN
    expect(shouldTrigger).toBe(false)
  })
})
