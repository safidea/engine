import { mapDtoToApp } from '@application/mappers/AppMapper'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'
import { ReadTableRecord } from '@application/usecases/table/ReadTableRecord'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { describe, test, expect } from '@jest/globals'

describe('ReadTableRecord', () => {
  test('should read a record with a formula that multiply two integer', async () => {
    const app = mapDtoToApp(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'fieldA',
                type: 'number',
              },
              {
                name: 'fieldB',
                type: 'number',
              },
              {
                name: 'fieldFormula',
                type: 'formula',
                formula: 'fieldA * fieldB',
              },
            ],
          },
        ],
      },
      UnstyledUI
    )
    const ormGateway = {
      read: () =>
        mapDtoToRecord(
          'tableA',
          {
            id: '1',
            fieldA: 5,
            fieldB: 2,
          },
          app.getTableFields('tableA')
        ),
    }

    // WHEN
    const record = await new ReadTableRecord(ormGateway as any, app).execute('tableA', '1')

    // THEN
    expect(record.fieldFormula).toBe(10)
  })

  test('should read a record with a formula that multiply with 0', async () => {
    const app = mapDtoToApp(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'fieldA',
                type: 'number',
              },
              {
                name: 'fieldB',
                type: 'number',
              },
              {
                name: 'fieldFormula',
                type: 'formula',
                formula: 'fieldA * fieldB',
              },
            ],
          },
        ],
      },
      UnstyledUI
    )
    const ormGateway = {
      read: () =>
        mapDtoToRecord(
          'tableA',
          {
            id: '1',
            fieldA: 5,
            fieldB: 0,
          },
          app.getTableFields('tableA')
        ),
    }

    // WHEN
    const record = await new ReadTableRecord(ormGateway as any, app).execute('tableA', '1')

    // THEN
    expect(record.fieldFormula).toBe(0)
  })

  test('should read a record with a rollup and formula in linked records', async () => {
    const app = mapDtoToApp(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'items',
                type: 'multiple_linked_records',
                table: 'tableB',
              },
              {
                name: 'fieldFormula',
                type: 'rollup',
                linkedRecords: 'items',
                linkedField: 'fieldA',
                formula: 'sum(values)',
              },
            ],
          },
          {
            name: 'tableB',
            fields: [
              {
                name: 'fieldA',
                type: 'number',
              },
              {
                name: 'fieldB',
                type: 'single_linked_record',
                table: 'tableA',
              },
            ],
          },
        ],
      },
      UnstyledUI
    )
    const ormGateway = {
      read: (table: string) => {
        return mapDtoToRecord(
          table,
          {
            id: '1',
            items: ['2', '3'],
          },
          app.getTableFields(table)
        )
      },
      list: (table: string) => {
        return [
          {
            id: '2',
            fieldA: 5,
            fieldB: '1',
          },
          {
            id: '3',
            fieldA: 2,
            fieldB: '1',
          },
        ].map((recordDto) => mapDtoToRecord(table, recordDto, app.getTableFields(table)))
      },
    }

    // WHEN
    const record = await new ReadTableRecord(ormGateway as any, app).execute('tableA', '1')

    // THEN
    expect(record.fieldFormula).toBe(7)
  })
})
