import { describe, test, expect } from '@jest/globals'
import { Table } from '@domain/entities/table/Table'
import { mapDtoToTable } from '@application/mappers/table/TableMapper'
import { TableDto } from '@application/dtos/table/TableDto'
import { GroupBy, List, SortBy } from '@domain/entities/page/components/List'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'
import { RecordDto } from '@application/dtos/table/RecordDto'
import { Field } from '@domain/entities/table/Field'
import { mapDtoToField } from '@application/mappers/table/FieldMapper'
import { FieldDto } from '@application/dtos/table/FieldDto'

describe('List Component', () => {
  test('config validation fail if table reference an invalid table', async () => {
    // GIVEN
    const tableName = 'tableA'

    // WHEN
    const call = () => new List(tableName, [], [], [], {} as any, [])

    // THEN
    expect(call).toThrow('tableA is not defined in tables')
  })

  test('config validation fail if groupBy reference an invalid field', async () => {
    // GIVEN
    const tableName = 'tableA'
    const groupBy: GroupBy[] = [
      {
        field: 'fieldX',
        order: 'desc',
      },
    ]
    const tables: Table[] = [
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'single_line_text',
          },
        ],
      },
    ].map((tableDto) => mapDtoToTable(tableDto as TableDto))

    // WHEN
    const call = () => new List(tableName, groupBy, [], [], {} as any, tables)

    // THEN
    expect(call).toThrow('field fieldX in groupBy is not defined in table tableA')
  })

  test('config validation fail if sortBy reference an invalid field', async () => {
    // GIVEN
    const tableName = 'tableA'
    const sortBy: SortBy[] = [
      {
        field: 'fieldX',
        order: 'desc',
      },
    ]
    const tables: Table[] = [
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'single_line_text',
          },
        ],
      },
    ].map((tableDto) => mapDtoToTable(tableDto as TableDto))

    // WHEN
    const call = () => new List(tableName, [], sortBy, [], {} as any, tables)

    // THEN
    expect(call).toThrow('field fieldX in sortBy is not defined in table tableA')
  })

  test('should sort records in desc order for a text field', async () => {
    // GIVEN
    const tableName = 'tableA'
    const sortBy: SortBy[] = [
      {
        field: 'fieldA',
        order: 'desc',
      },
    ]
    const fields: Field[] = [
      {
        name: 'fieldA',
        type: 'single_line_text',
      },
    ].map((fieldDto) => mapDtoToField(fieldDto as FieldDto))
    const tables: Table[] = [
      {
        name: 'tableA',
        fields: fields,
      },
    ].map((tableDto) => mapDtoToTable(tableDto as TableDto))
    const records = [
      {
        id: '1',
        fieldA: 'a',
      },
      {
        id: '2',
        fieldA: 'b',
      },
      {
        id: '3',
        fieldA: 'c',
      },
    ].map((record) => mapDtoToRecord(tableName, record as RecordDto, fields))

    // WHEN
    const sortedRecords = new List(tableName, [], sortBy, [], {} as any, tables).sortRecords({
      records,
      sortBy,
      fields,
    })

    // THEN
    expect(sortedRecords.map((r) => r.id)).toEqual(['3', '2', '1'])
  })

  test('should sort records in desc order for a datetime field', async () => {
    // GIVEN
    const tableName = 'tableA'
    const sortBy: SortBy[] = [
      {
        field: 'fieldA',
        order: 'desc',
      },
    ]
    const fields: Field[] = [
      {
        name: 'fieldA',
        type: 'datetime',
      },
    ].map((fieldDto) => mapDtoToField(fieldDto as FieldDto))
    const tables: Table[] = [
      {
        name: 'tableA',
        fields: fields,
      },
    ].map((tableDto) => mapDtoToTable(tableDto as TableDto))
    const records = [
      {
        id: '1',
        fieldA: new Date('2020-01-01').toISOString(),
      },
      {
        id: '2',
        fieldA: new Date('2021-01-01').toISOString(),
      },
      {
        id: '3',
        fieldA: new Date('2022-01-01').toISOString(),
      },
    ].map((record) => mapDtoToRecord(tableName, record as RecordDto, fields))

    // WHEN
    const sortedRecords = new List(tableName, [], sortBy, [], {} as any, tables).sortRecords({
      records,
      sortBy,
      fields,
    })

    // THEN
    expect(sortedRecords.map((r) => r.id)).toEqual(['3', '2', '1'])
  })
})
