import { describe, test, expect, mock } from 'bun:test'
import { RecordUpdatedTrigger } from './RecordUpdatedTrigger'
import { TableList } from '@entities/app/table/TableList'

describe('RecordUpdatedTrigger', () => {
  test("should return false if tables doesn't match", async () => {
    // GIVEN
    const tables = new TableList(
      [
        {
          name: 'invoices',
          fields: [
            {
              name: 'name',
              type: 'single_line_text',
            },
          ],
        },
        {
          name: 'invoices_items',
          fields: [
            {
              name: 'name',
              type: 'single_line_text',
            },
          ],
        },
      ],
      {
        database: {} as any,
      } as any
    )
    const trigger = new RecordUpdatedTrigger(
      {
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
      },
      {} as any,
      { tables } as any
    )
    const usecases = {
      readTableRecord: {
        execute: mock(() => Promise.resolve({ id: '1', name: 'test' })),
      },
    } as any

    // WHEN
    const result = await trigger.shouldTrigger({
      event: 'record_updated',
      context: {
        table: 'invoices',
        record: { id: '1', name: 'test updated' },
        updatedFields: ['name'],
      },
    })

    // THEN
    expect(result).toBe(false)
    expect(usecases.readTableRecord.execute).not.toHaveBeenCalled()
  })
})
