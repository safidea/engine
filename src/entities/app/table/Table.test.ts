import { Table } from '@entities/app/table/Table'
import { describe, test, expect } from 'bun:test'
import { TableServices } from './TableServices'
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
    expect(table.fields.find((f) => f.name === 'name')).toBeDefined()
    expect(table.fields.find((f) => f.name === 'id')).toBeDefined()
    expect(table.fields.find((f) => f.name === 'created_time')).toBeDefined()
    expect(table.fields.find((f) => f.name === 'last_modified_time')).toBeDefined()
    expect(table.fields.find((f) => f.name === 'deleted_time')).toBeDefined()
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
    expect(table.fields.find((f) => f.name === 'id' && f.type === 'number')).toBeDefined()
  })
})
