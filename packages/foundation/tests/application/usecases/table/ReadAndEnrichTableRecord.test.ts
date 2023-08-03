import { TableDto } from '@application/dtos/table/TableDto'
import { mapDtoToApp } from '@application/mappers/AppMapper'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'
import { ReadAndEnrichTableRecord } from '@application/usecases/table/ReadAndEnrichTableRecord'
import { describe, test, expect } from '@jest/globals'

describe('CreateTableRecord', () => {
  test('should enrich a record with dependancies', async () => {
    // GIVEN
    const tables: TableDto[] = [
      {
        name: 'tableA',
        fields: [
          {
            name: 'name',
            type: 'single_line_text',
          },
          {
            name: 'items',
            type: 'multiple_linked_records',
            table: 'tableB',
          },
        ],
      },
      {
        name: 'tableB',
        fields: [
          {
            name: 'name',
            type: 'single_line_text',
          },
        ],
      },
    ]
    const app = mapDtoToApp({ tables }, {} as any)
    const ormGateway = {
      read: (table: string) => {
        return mapDtoToRecord(
          table,
          {
            id: '1',
            name: 'test',
            items: ['2', '3'],
          },
          app.getTableFields(table)
        )
      },
      list(table: string) {
        return [
          {
            id: '2',
            name: 'item1',
          },
          {
            id: '3',
            name: 'item2',
          },
        ].map((record) => mapDtoToRecord(table, record, app.getTableFields(table)))
      },
    }

    // WHEN
    const record = await new ReadAndEnrichTableRecord(ormGateway as any, app).execute('tableA', '1')

    // THEN
    expect(record.id).toEqual('1')
    expect(record.name).toEqual('test')
    expect(record.items).toEqual([
      {
        id: '2',
        name: 'item1',
      },
      {
        id: '3',
        name: 'item2',
      },
    ])
  })
})
