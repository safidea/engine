import { JsonOrm } from '@drivers/database/JsonDatabase'
import { describe, test, expect } from '@jest/globals'
import { helpers } from '../../../utils/unit/fixtures'
import { TableDto } from '@adapters/api/table/dtos/TableDto'

describe('JsonOrm', () => {
  test('should update a record by id', async () => {
    // GIVEN
    const jsonOrm = new JsonOrm(helpers.getDedicatedTmpFolder())
    await jsonOrm.setDB({
      tableA: [
        {
          id: '1',
          name: 'test A',
        },
      ],
    })

    // WHEN
    const update = {
      id: '1',
      name: 'test B',
    }
    await jsonOrm.softUpdateById('tableA', update, '1')

    // THEN
    const db = await jsonOrm.getDB()
    const updatedRecord = db.tableA.find((record: any) => record.id === '1')
    expect(updatedRecord?.name).toEqual('test B')
  })

  test('should return an autonumber value for an autonumber field', async () => {
    // GIVEN
    const jsonOrm = new JsonOrm(helpers.getDedicatedTmpFolder())
    const tables: TableDto[] = [
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
    jsonOrm.configure(tables)

    // WHEN
    await jsonOrm.create('tableA', {
      id: '1',
    })

    // THEN
    const db = await jsonOrm.getDB()
    const record = db.tableA.find((record: any) => record.id === '1')
    expect(record?.autonumber).toEqual(1)
  })
})
