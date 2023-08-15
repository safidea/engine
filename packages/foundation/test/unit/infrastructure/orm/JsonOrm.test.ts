import { JsonOrm } from '@infrastructure/orm/JsonOrm'
import { describe, test, expect } from '@jest/globals'
import { helpers } from '../../../utils/unit/fixtures'

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
})
