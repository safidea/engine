import { FieldMapper } from '@adapters/api/table/mappers/FieldMapper'
import { Table } from '@entities/app/table/Table'
import { describe, test, expect } from '@jest/globals'

describe('Table', () => {
  test('should add default fields in addition of config', async () => {
    // GIVEN
    const tableName = 'tableA'
    const fields = FieldMapper.toEntities([
      {
        name: 'name',
        type: 'single_line_text',
      },
    ])

    // WHEN
    const table = new Table(tableName, fields)

    // THEN
    expect(table.fields).toEqual(
      FieldMapper.toEntities([
        {
          name: 'name',
          type: 'single_line_text',
        },
        {
          name: 'id',
          type: 'single_line_text',
          optional: true,
        },
        {
          name: 'created_time',
          type: 'datetime',
          optional: true,
        },
        {
          name: 'last_modified_time',
          type: 'datetime',
          optional: true,
        },
        {
          name: 'deleted_time',
          type: 'datetime',
          optional: true,
        },
      ])
    )
  })

  test('should create a default field manually', async () => {
    // GIVEN
    const tableName = 'tableA'
    const fields = FieldMapper.toEntities([
      {
        name: 'name',
        type: 'single_line_text',
      },
      {
        name: 'id',
        type: 'number',
      },
    ])

    // WHEN
    const table = new Table(tableName, fields)

    // THEN
    expect(table.fields).toEqual(
      FieldMapper.toEntities([
        {
          name: 'name',
          type: 'single_line_text',
        },
        {
          name: 'id',
          type: 'number',
        },
        {
          name: 'created_time',
          type: 'datetime',
          optional: true,
        },
        {
          name: 'last_modified_time',
          type: 'datetime',
          optional: true,
        },
        {
          name: 'deleted_time',
          type: 'datetime',
          optional: true,
        },
      ])
    )
  })
})
