import { describe, test, expect } from 'bun:test'
import { JsonDatabase } from './JsonDatabase'
import { helpers } from '@test/unit/fixtures'
import { TableParams } from '@entities/app/table/TableParams'

describe('JsonDatabase', () => {
  test('should update a record by id', async () => {
    // GIVEN
    const database = new JsonDatabase({ folder: helpers.getDedicatedTmpFolder() })
    await database.setDB({
      tableA: [
        {
          id: '1',
          created_time: '2021-01-01T00:00:00.000Z',
          name: 'test A',
        },
      ],
    })

    // WHEN
    const update = {
      id: '1',
      name: 'test B',
      last_modified_time: '2021-01-01T00:00:00.000Z',
    }
    await database.update('tableA', update)

    // THEN
    const db = await database.getDB()
    const updatedRecord = db.tableA.find((record: any) => record.id === '1')
    expect(updatedRecord?.name).toEqual('test B')
  })

  test('should return an autonumber value for an autonumber field', async () => {
    // GIVEN
    const database = new JsonDatabase({ folder: helpers.getDedicatedTmpFolder() })
    const tables: TableParams[] = [
      {
        name: 'tableA',
        fields: [
          {
            name: 'autonumber',
            type: 'autonumber',
          },
        ],
      },
    ]
    database.configure(tables)

    // WHEN
    await database.create('tableA', {
      id: '1',
      created_time: '2021-01-01T00:00:00.000Z',
    })

    // THEN
    const db = await database.getDB()
    const record = db.tableA.find((record: any) => record.id === '1')
    expect(record?.autonumber).toEqual(1)
  })
})
