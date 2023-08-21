import { AppMapper } from '@adapter/api/app/AppMapper'
import { OrmSpi } from '@adapter/spi/orm/OrmSpi'
import { RecordMapper } from '@adapter/spi/orm/mappers/RecordMapper'
import { SyncTableRecords } from '@application/usecases/table/SyncTableRecords'
import { JsonOrm } from '@infrastructure/orm/JsonOrm'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { helpers, describe, test, expect } from '../../../../utils/unit/fixtures'
import { FilterMapper } from '@adapter/spi/orm/mappers/FilterMapper'
import { Filter } from '@domain/entities/orm/Filter'
import { Record } from '@domain/entities/orm/Record'

describe('SyncTableRecords', () => {
  test('should sync a created record', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const orm = new JsonOrm(helpers.getDedicatedTmpFolder())
    const ormSpi = new OrmSpi(orm, app, {} as any)
    ormSpi.createMany = jest.fn()
    const record = RecordMapper.toEntity(
      {
        id: '1',
        fieldA: 'test',
      },
      app.getTableByName('tableA'),
      'create'
    )
    ormSpi.read = jest.fn(async () =>
      RecordMapper.toEntity(
        {
          id: '1',
          fieldA: 'test',
          created_time: new Date().toISOString(),
        },
        app.getTableByName('tableA')
      )
    )
    const instance = {
      emit: jest.fn(),
    } as any

    // WHEN
    await new SyncTableRecords(ormSpi, app, instance).execute([record])

    // THEN
    expect(ormSpi.createMany).toBeCalledWith('tableA', [record])
  })

  test('should sync multiple created records', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const orm = new JsonOrm(helpers.getDedicatedTmpFolder())
    const ormSpi = new OrmSpi(orm, app, {} as any)
    ormSpi.createMany = jest.fn()
    const records = RecordMapper.toEntities(
      [
        {
          id: '1',
          fieldA: 'test A',
        },
        {
          id: '2',
          fieldA: 'test B',
        },
        {
          id: '3',
          fieldA: 'test C',
        },
      ],
      app.getTableByName('tableA'),
      'create'
    )
    ormSpi.read = jest.fn(async (table, id) =>
      RecordMapper.toEntities(
        [
          {
            id: '1',
            fieldA: 'test A',
            created_time: new Date().toISOString(),
          },
          {
            id: '2',
            fieldA: 'test B',
            created_time: new Date().toISOString(),
          },
          {
            id: '3',
            fieldA: 'test C',
            created_time: new Date().toISOString(),
          },
        ],
        app.getTableByName('tableA')
      ).find((record) => record.id === id)
    )
    const instance = {
      emit: jest.fn(),
    } as any

    // WHEN
    await new SyncTableRecords(ormSpi, app, instance).execute(records)

    // THEN
    expect(ormSpi.createMany).toBeCalledWith('tableA', records)
  })

  test('should sync an updated record', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const orm = new JsonOrm(helpers.getDedicatedTmpFolder())
    const ormSpi = new OrmSpi(orm, app, {} as any)
    ormSpi.updateMany = jest.fn()
    const record = RecordMapper.toEntity(
      {
        id: '1',
        fieldA: 'test',
      },
      app.getTableByName('tableA'),
      'update'
    )
    ormSpi.read = jest.fn(async () =>
      RecordMapper.toEntity(
        {
          id: '1',
          fieldA: 'test',
          created_time: new Date().toISOString(),
        },
        app.getTableByName('tableA')
      )
    )
    const instance = {
      emit: jest.fn(),
    } as any

    // WHEN
    await new SyncTableRecords(ormSpi, app, instance).execute([record])

    // THEN
    expect(ormSpi.updateMany).toBeCalledWith('tableA', [record])
  })

  test('should sync multiple updated records', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const orm = new JsonOrm(helpers.getDedicatedTmpFolder())
    const ormSpi = new OrmSpi(orm, app, {} as any)
    ormSpi.updateMany = jest.fn()
    const records = RecordMapper.toEntities(
      [
        {
          id: '1',
          fieldA: 'test A',
        },
        {
          id: '2',
          fieldA: 'test B',
        },
        {
          id: '3',
          fieldA: 'test C',
        },
      ],
      app.getTableByName('tableA'),
      'update'
    )
    ormSpi.read = jest.fn(async (table, id) =>
      RecordMapper.toEntities(
        [
          {
            id: '1',
            fieldA: 'test A',
            created_time: new Date().toISOString(),
          },
          {
            id: '2',
            fieldA: 'test B',
            created_time: new Date().toISOString(),
          },
          {
            id: '3',
            fieldA: 'test C',
            created_time: new Date().toISOString(),
          },
        ],
        app.getTableByName('tableA')
      ).find((record) => record.id === id)
    )
    const instance = {
      emit: jest.fn(),
    } as any

    // WHEN
    await new SyncTableRecords(ormSpi, app, instance).execute(records)

    // THEN
    expect(ormSpi.updateMany).toBeCalledWith('tableA', records)
  })

  test('should sync updated, created and deleted records', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const orm = new JsonOrm(helpers.getDedicatedTmpFolder())
    const ormSpi = new OrmSpi(orm, app, {} as any)
    const db: { [key: string]: Record[] } = {}
    ormSpi.createMany = (table: string, records: Record[]): any => {
      db[table] = [...(db[table] ?? []), ...records]
    }
    ormSpi.updateMany = (table: string, records: Record[]): any => {
      db[table] = [...(db[table] ?? []), ...records]
    }
    const recordToUpdate = RecordMapper.toEntity(
      {
        id: '1',
        fieldA: 'test',
      },
      app.getTableByName('tableA'),
      'update'
    )
    const recordsToCreate = RecordMapper.toEntities(
      [
        {
          id: '2',
          fieldA: 'test A',
        },
        {
          id: '3',
          fieldA: 'test B',
        },
        {
          id: '4',
          fieldA: 'test C',
        },
      ],
      app.getTableByName('tableA'),
      'create'
    )
    const recordsToDelete = RecordMapper.toEntities(
      [
        {
          id: '5',
          fieldA: 'test D',
        },
        {
          id: '6',
          fieldA: 'test E',
        },
      ],
      app.getTableByName('tableA'),
      'delete'
    )
    const records = [recordToUpdate, ...recordsToCreate, ...recordsToDelete]
    ormSpi.read = jest.fn(async (table, id) =>
      RecordMapper.toEntities(
        [
          {
            id: '1',
            fieldA: 'test',
            created_time: new Date().toISOString(),
            modified_time: new Date().toISOString(),
          },
          {
            id: '2',
            fieldA: 'test A',
            created_time: new Date().toISOString(),
          },
          {
            id: '3',
            fieldA: 'test B',
            created_time: new Date().toISOString(),
          },
          {
            id: '4',
            fieldA: 'test C',
            created_time: new Date().toISOString(),
          },
          {
            id: '5',
            fieldA: 'test D',
            created_time: new Date().toISOString(),
            deleted_time: new Date().toISOString(),
          },
          {
            id: '6',
            fieldA: 'test E',
            created_time: new Date().toISOString(),
            deleted_time: new Date().toISOString(),
          },
        ],
        app.getTableByName('tableA')
      ).find((record) => record.id === id)
    )
    const instance = {
      emit: jest.fn(),
    } as any

    // WHEN
    await new SyncTableRecords(ormSpi, app, instance).execute(records)

    // THEN
    expect(db.tableA).toHaveLength(6)
    expect(db.tableA).toContainEqual(recordToUpdate)
    expect(db.tableA).toContainEqual(recordsToCreate[0])
    expect(db.tableA).toContainEqual(recordsToCreate[1])
    expect(db.tableA).toContainEqual(recordsToCreate[2])
    expect(db.tableA).toContainEqual(recordsToDelete[0])
    expect(db.tableA).toContainEqual(recordsToDelete[1])
  })

  test('should sync resources', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
            ],
          },
          {
            name: 'tableB',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const ormSpi = new OrmSpi(new JsonOrm(helpers.getDedicatedTmpFolder()), app, {} as any)
    const recordsTableA = RecordMapper.toEntities(
      [
        {
          id: '1',
          created_time: new Date().toISOString(),
          fieldA: 'test A',
        },
        {
          id: '2',
          created_time: new Date().toISOString(),
          fieldA: 'test B',
        },
        {
          id: '3',
          created_time: new Date().toISOString(),
          fieldA: 'test C',
        },
      ],
      app.getTableByName('tableA')
    )
    const recordsTableB = RecordMapper.toEntities(
      [
        {
          id: '4',
          created_time: new Date().toISOString(),
          fieldA: 'test D',
        },
        {
          id: '5',
          created_time: new Date().toISOString(),
          fieldA: 'test E',
        },
        {
          id: '6',
          created_time: new Date().toISOString(),
          fieldA: 'test F',
        },
      ],
      app.getTableByName('tableA')
    )
    ormSpi.list = jest.fn(async (table: string) => {
      switch (table) {
        case 'tableA':
          return recordsTableA
        case 'tableB':
          return recordsTableB
        default:
          return []
      }
    })
    const instance = {
      emit: jest.fn(),
    } as any

    // WHEN
    const { tableA, tableB } = await new SyncTableRecords(ormSpi, app, instance).execute(
      [],
      [
        {
          table: 'tableA',
        },
        {
          table: 'tableB',
        },
      ]
    )

    // THEN
    expect(tableA).toStrictEqual(recordsTableA)
    expect(tableB).toStrictEqual(recordsTableB)
  })

  test('should sync resources with filters', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
            ],
          },
          {
            name: 'tableB',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const ormSpi = new OrmSpi(new JsonOrm(helpers.getDedicatedTmpFolder()), app, {} as any)
    const recordsTableA = RecordMapper.toEntities(
      [
        {
          id: '1',
          created_time: new Date().toISOString(),
          fieldA: 'test A',
        },
        {
          id: '2',
          created_time: new Date().toISOString(),
          fieldA: 'test B',
        },
        {
          id: '3',
          created_time: new Date().toISOString(),
          fieldA: 'test C',
        },
      ],
      app.getTableByName('tableA')
    )
    const recordsTableB = RecordMapper.toEntities(
      [
        {
          id: '4',
          created_time: new Date().toISOString(),
          fieldA: 'test D',
        },
        {
          id: '5',
          created_time: new Date().toISOString(),
          fieldA: 'test E',
        },
        {
          id: '6',
          created_time: new Date().toISOString(),
          fieldA: 'test F',
        },
      ],
      app.getTableByName('tableA')
    )
    ormSpi.list = jest.fn(async (table: string, filters: Filter[]) => {
      switch (table) {
        case 'tableA':
          return recordsTableA.filter((record) => filters[0].values.includes(record.id as never))
        case 'tableB':
          return recordsTableB.filter((record) => filters[0].values.includes(record.id as never))
        default:
          return []
      }
    })
    const instance = {
      emit: jest.fn(),
    } as any

    // WHEN
    const { tableA, tableB } = await new SyncTableRecords(ormSpi, app, instance).execute(
      [],
      [
        {
          table: 'tableA',
          filters: [
            FilterMapper.toEntity({
              field: 'id',
              operator: 'is_any_of',
              value: ['1', '2'],
            }),
          ],
        },
        {
          table: 'tableB',
          filters: [
            FilterMapper.toEntity({
              field: 'id',
              operator: 'is_any_of',
              value: ['5', '6'],
            }),
          ],
        },
      ]
    )

    // THEN
    recordsTableA.pop()
    recordsTableB.shift()
    expect(tableA).toStrictEqual(recordsTableA)
    expect(tableB).toStrictEqual(recordsTableB)
  })

  test('should sync resources with formulas', async () => {
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
    const ormSpi = new OrmSpi(new JsonOrm(helpers.getDedicatedTmpFolder()), app, {} as any)
    const record = RecordMapper.toEntity(
      {
        id: '1',
        created_time: new Date().toISOString(),
        fieldA: 5,
        fieldB: 3,
      },
      app.getTableByName('tableA')
    )
    ormSpi.list = jest.fn(async () => [record])
    const instance = {
      emit: jest.fn(),
    } as any

    // WHEN
    const { tableA } = await new SyncTableRecords(ormSpi, app, instance).execute(
      [],
      [
        {
          table: 'tableA',
        },
      ]
    )

    // THEN
    const readRecord = tableA?.[0]
    expect(readRecord?.getFieldValue('fieldFormula')).toStrictEqual(15)
  })

  test('should emit events after resources sync', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const orm = new JsonOrm(helpers.getDedicatedTmpFolder())
    const ormSpi = new OrmSpi(orm, app, {} as any)
    ormSpi.createMany = jest.fn()
    const record = RecordMapper.toEntity(
      {
        id: '1',
        fieldA: 'test',
      },
      app.getTableByName('tableA'),
      'create'
    )
    const createdRecord = RecordMapper.toEntity(
      {
        id: '1',
        fieldA: 'test',
        created_time: new Date().toISOString(),
      },
      app.getTableByName('tableA')
    )
    ormSpi.read = jest.fn(async () => createdRecord)
    const instance = {
      emit: jest.fn(),
    } as any

    // WHEN
    await new SyncTableRecords(ormSpi, app, instance).execute([record])

    // THEN
    expect(instance.emit).toBeCalledWith('record_created', {
      table: 'tableA',
      data: createdRecord.toDto(),
    })
  })
})
