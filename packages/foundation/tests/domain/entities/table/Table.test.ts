import { FieldDto } from '@application/dtos/table/FieldDto'
import { mapDtoToField } from '@application/mappers/table/FieldMapper'
import { Field } from '@domain/entities/table/Field'
import { Table } from '@domain/entities/table/Table'
import { describe, test, expect } from '@jest/globals'

describe('Table', () => {
  test('should add default fields in addition of config', async () => {
    // GIVEN
    const tableName = 'tableA'
    const fields: Field[] = [
      {
        name: 'name',
        type: 'single_line_text',
      },
    ].map((fieldDto) => mapDtoToField(fieldDto as FieldDto))

    // WHEN
    const table = new Table(tableName, fields)

    // THEN
    expect(table.fields).toEqual([
      mapDtoToField({
        name: 'name',
        type: 'single_line_text',
      }),
      mapDtoToField({
        name: 'id',
        type: 'single_line_text',
        optional: true,
      }),
      mapDtoToField({
        name: 'created_time',
        type: 'datetime',
        optional: true,
      }),
      mapDtoToField({
        name: 'last_modified_time',
        type: 'datetime',
        optional: true,
      }),
      mapDtoToField({
        name: 'deleted_time',
        type: 'datetime',
        optional: true,
      }),
    ])
  })
})
