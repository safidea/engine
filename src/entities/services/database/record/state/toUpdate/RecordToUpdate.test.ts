import { describe, test, expect } from 'bun:test'
import { Table } from '@entities/app/table/Table'
import { RecordToUpdate } from './RecordToUpdate'
import { PersistedRecord } from '../persisted/PersistedRecord'

describe('RecordToCreate', () => {
  test('should create a record with "updated" status', async () => {
    // GIVEN
    const values = {
      id: '1',
      created_time: new Date().toISOString(),
      name: 'test',
    }
    const updatedValues = { name: 'test updated' }
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'name',
            type: 'single_line_text',
          },
          {
            name: 'age',
            type: 'number',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const record = new RecordToUpdate(values, table, updatedValues)

    // THEN
    expect(record.fields.name).toEqual('test updated')
    expect(record.fields).not.toHaveProperty('age')
  })

  test('should throw an error if update permission is not respected', async () => {
    // GIVEN
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'name',
            type: 'single_line_text',
            permissions: {
              update: {
                formula: 'age === undefined',
              },
            },
          },
          {
            name: 'age',
            type: 'number',
            optional: true,
          },
        ],
      },
      {} as any
    )
    const updatedRecord = new RecordToUpdate(
      {
        id: '1',
        created_time: new Date().toISOString(),
        name: 'test updated',
      },
      table,
      {
        name: 'test updated',
      }
    )
    const persistedRecord = new PersistedRecord(
      {
        id: '1',
        created_time: new Date().toISOString(),
        name: 'test',
        age: 10,
      },
      table
    )

    // WHEN
    const call = () => updatedRecord.validateFieldsPermissions(persistedRecord)

    // THEN
    expect(call).toThrow('field "name" cannot be updated')
  })
})
