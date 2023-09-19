import { describe, test, expect } from '@jest/globals'
import { TableList } from '../table/TableList'
import { AutomationList } from './AutomationList'
import { PersistedRecord } from '@entities/services/database/record/state/persisted/PersistedRecord'
import { Table } from '../table/Table'

describe('AutomationList', () => {
  test('should trigger matching automation when emit an event', async () => {
    // GIVEN
    const database = {
      softUpdate: jest.fn(),
      read: jest.fn(
        (table: Table) =>
          new PersistedRecord(
            {
              id: '1',
              created_time: new Date().toISOString(),
              fieldA: 'test',
            },
            table
          )
      ),
    } as any
    const templater = {
      compile: jest.fn((value) => ({
        render: jest.fn(() => value),
      })),
    } as any
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
        database,
      } as any
    )
    const automations = new AutomationList(
      [
        {
          name: 'updateRecord',
          trigger: { event: 'record_created', table: 'tableA' },
          actions: [
            {
              name: 'update-record',
              type: 'update_record',
              fields: { fieldA: 'test updated' },
              table: 'tableA',
              recordId: '1',
            },
          ],
        },
      ],
      { database, storage: {}, templater, converter: {}, logger: {} } as any,
      { tables } as any
    )

    // WHEN
    await automations.emit({
      event: 'record_created',
      context: { table: 'tableA', record: { id: '1' } },
    })

    // THEN
    expect(database.softUpdate).toHaveBeenCalled()
  })
})
