import { describe, test, expect, mock } from 'bun:test'
import { UpdateRecordAction } from './UpdateRecordAction'
import { TableList } from '@entities/app/table/TableList'
import { PersistedRecord } from '@entities/services/database/record/state/persisted/PersistedRecord'
import { Table } from '@entities/app/table/Table'

describe('UpdateRecordAction', () => {
  test('config validation fail if update_record action references an invalid field', async () => {
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

    // WHEN
    const call = () =>
      new UpdateRecordAction(
        {
          type: 'update_record',
          fields: { fieldX: 'test' },
          table: 'tableA',
          name: 'update_record',
          recordId: '1',
        },
        {} as any,
        { tables } as any
      )

    // THEN
    expect(call).toThrow('field "fieldX" is not defined in table "tableA"')
  })

  test('config validation fail if update_record action references an invalid table', async () => {
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

    // WHEN
    const call = () =>
      new UpdateRecordAction(
        {
          type: 'update_record',
          fields: {},
          table: 'tableX',
          name: 'update_record',
          recordId: '1',
        },
        {} as any,
        { tables } as any
      )

    // THEN
    expect(call).toThrow('table "tableX" is not defined in tables')
  })

  test('config validation fail if update_record action references an invalid field and a valid field', async () => {
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

    // WHEN
    const call = () =>
      new UpdateRecordAction(
        {
          type: 'update_record',
          fields: { fieldA: 'Essentiel', fieldY: 'test' },
          table: 'tableA',
          name: 'update_record',
          recordId: '1',
        },
        {} as any,
        { tables } as any
      )

    // THEN
    expect(call).toThrow('field "fieldY" is not defined in table "tableA"')
  })

  test('should update a record when execute action', async () => {
    // GIVEN
    const database = {
      read: mock(
        async (table: Table) =>
          new PersistedRecord(
            { id: '1', fieldA: 'Essentiel', created_time: new Date().toISOString() },
            table
          )
      ),
      softUpdate: mock(() => Promise.resolve()),
    } as any
    const templater = {
      compile: mock((value) => ({
        render: mock(() => value),
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
    const action = new UpdateRecordAction(
      {
        type: 'update_record',
        fields: { fieldA: '{{trigger.text}}' },
        table: 'tableA',
        name: 'update_record',
        recordId: '1',
      },
      {
        database,
        templater,
      } as any,
      { tables } as any
    )

    // WHEN
    await action.execute({ trigger: { text: 'test' } })

    // THEN
    expect(database.softUpdate).toHaveBeenCalled()
  })
})
