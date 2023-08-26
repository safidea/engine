import { AppMapper } from '@adapter/api/app/AppMapper'
import { RecordMapper } from '@adapter/spi/orm/mappers/RecordMapper'
import { ReadTableRecord } from '@application/usecases/table/ReadTableRecord'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { describe, test, expect } from '@jest/globals'

describe('ReadTableRecord', () => {
  test('should read a record with a formula that multiply two integer', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
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
      { ui: UnstyledUI }
    )
    const OrmSpi = {
      read: () =>
        RecordMapper.toEntity(
          {
            id: '1',
            created_time: new Date().toISOString(),
            fieldA: 5,
            fieldB: 2,
          },
          app.getTableByName('tableA')
        ),
    }

    // WHEN
    const record = await new ReadTableRecord(OrmSpi as any, app).execute('tableA', '1')

    // THEN
    expect(record.getFieldValue('fieldFormula')).toBe(10)
  })

  test('should read a record with a formula that multiply with 0', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
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
      { ui: UnstyledUI }
    )
    const OrmConnection = {
      read: () =>
        RecordMapper.toEntity(
          {
            id: '1',
            created_time: new Date().toISOString(),
            fieldA: 5,
            fieldB: 0,
          },
          app.getTableByName('tableA')
        ),
    }

    // WHEN
    const record = await new ReadTableRecord(OrmConnection as any, app).execute('tableA', '1')

    // THEN
    expect(record.getFieldValue('fieldFormula')).toBe(0)
  })

  test('should read a record with a rollup and formula in linked records', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
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
      { ui: UnstyledUI }
    )
    const OrmConnection = {
      read: (table: string) => {
        return RecordMapper.toEntity(
          {
            id: '1',
            created_time: new Date().toISOString(),
            items: ['2', '3'],
          },
          app.getTableByName(table)
        )
      },
      list: (table: string) => {
        return RecordMapper.toEntities(
          [
            {
              id: '2',
              created_time: new Date().toISOString(),
              fieldA: 5,
              fieldB: '1',
            },
            {
              id: '3',
              created_time: new Date().toISOString(),
              fieldA: 2,
              fieldB: '1',
            },
          ],
          app.getTableByName(table)
        )
      },
    }

    // WHEN
    const record = await new ReadTableRecord(OrmConnection as any, app).execute('tableA', '1')

    // THEN
    expect(record.getFieldValue('fieldFormula')).toBe(7)
  })
})
