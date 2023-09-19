import { Table } from '@entities/app/table/Table'
import { describe, test, expect } from '@jest/globals'
import { PersistedRecord } from './PersistedRecord'

describe('PersistedRecord', () => {
  test('should return a field value', async () => {
    // GIVEN
    const values = {
      id: '1',
      created_time: new Date().toISOString(),
      name: 'test',
    }
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'name',
            type: 'single_line_text',
            default: 'test',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const record = new PersistedRecord(values, table)

    // THEN
    expect(record.getFieldValue('name')).toEqual('test')
  })

  test('should create a persisted record with optional value', async () => {
    // GIVEN
    const values = {
      id: '1',
      created_time: new Date().toISOString(),
      name: 'test',
    }
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'name',
            type: 'single_line_text',
            default: 'test',
          },
          {
            name: 'birthdate',
            type: 'datetime',
            optional: true,
          },
          {
            name: 'index',
            type: 'autonumber',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const record = new PersistedRecord(values, table)

    // THEN
    expect(record.getFieldValue('name')).toEqual('test')
    expect(record.getFieldValue('birthdate')).toEqual(undefined)
  })
})
