import { InMemoryOrm } from '@infrastructure/orm/InMemoryOrm'
import { describe, test, expect } from '@jest/globals'
import { helpers } from '../../fixtures'

describe('InMemoryOrm', () => {
  test('should update a record by id', async () => {
    // GIVEN
    const inMemoryOrm = new InMemoryOrm(helpers.getTmpFolder())
    await inMemoryOrm.setDB({
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
    await inMemoryOrm.softUpdateById('tableA', update, '1')

    // THEN
    const db = await inMemoryOrm.getDB()
    const updatedRecord = db.tableA.find((record: any) => record.id === '1')
    expect(updatedRecord?.name).toEqual('test B')
  })
})
