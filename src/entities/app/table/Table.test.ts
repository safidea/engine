import { Table } from '@entities/app/table/Table'
import { describe, test, expect } from '@jest/globals'
import { TableServices } from './TableServices'
import { newField } from './field/Field'
import { TableParams } from './TableParams'

describe('Table', () => {
  test('should add default fields in addition of config', async () => {
    // GIVEN
    const params: TableParams = {
      name: 'tableA',
      fields: [
        {
          name: 'name',
          type: 'single_line_text',
        },
      ],
    }

    // WHEN
    const table = new Table(params, {} as TableServices)

    // THEN
    expect(table.fields).toContainEqual(
      newField({ type: 'single_line_text', name: 'name' }, {} as TableServices)
    )
    expect(table.fields).toContainEqual(
      newField({ type: 'single_line_text', name: 'id' }, {} as TableServices)
    )
    expect(table.fields).toContainEqual(
      newField({ type: 'datetime', name: 'created_time' }, {} as TableServices)
    )
    expect(table.fields).toContainEqual(
      newField(
        { type: 'datetime', name: 'last_modified_time', optional: true },
        {} as TableServices
      )
    )
    expect(table.fields).toContainEqual(
      newField({ type: 'datetime', name: 'deleted_time', optional: true }, {} as TableServices)
    )
  })

  test('should create a default field manually', async () => {
    // GIVEN
    const params: TableParams = {
      name: 'tableA',
      fields: [
        {
          name: 'name',
          type: 'single_line_text',
        },
        {
          name: 'id',
          type: 'number',
        },
      ],
    }

    // WHEN
    const table = new Table(params, {} as TableServices)

    // THEN
    expect(table.fields).toContainEqual(
      newField({ type: 'number', name: 'id' }, {} as TableServices)
    )
  })
})
