import { InMemoryOrm } from '@infrastructure/orm/InMemoryOrm'
import { describe, test, expect } from '@jest/globals'
import { helpers } from '../../../utils/unit/fixtures'

jest.setTimeout(10000)

describe('InMemoryOrm', () => {
  test('should update a record by id', async () => {
    // GIVEN
    const inMemoryOrm = new InMemoryOrm(helpers.getDedicatedTmpFolder())
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

  test('should bulk create and update records at the same time', async () => {
    // GIVEN
    const inMemoryOrm = new InMemoryOrm(helpers.getDedicatedTmpFolder())
    inMemoryOrm.configure([
      {
        name: 'tableA',
        fields: [
          {
            name: 'id',
            type: 'single_line_text',
          },
          {
            name: 'name',
            type: 'single_line_text',
          },
        ],
      },
    ])

    // WHEN
    await inMemoryOrm.createMany('tableA', [
      {
        id: '1',
        name: 'test A',
      },
      {
        id: '2',
        name: 'test B',
      },
      {
        id: '3',
        name: 'test C',
      },
    ])
    await Promise.all([
      inMemoryOrm.createMany('tableA', [
        {
          id: '4',
          name: 'test A',
        },
        {
          id: '5',
          name: 'test B',
        },
        {
          id: '6',
          name: 'test C',
        },
      ]),
      inMemoryOrm.softUpdateMany('tableA', [
        {
          id: '1',
          name: 'test D',
        },
        {
          id: '2',
          name: 'test E',
        },
        {
          id: '3',
          name: 'test F',
        },
      ]),
    ])

    // THEN
    const db = await inMemoryOrm.list('tableA')
    expect(db).toStrictEqual([
      {
        id: '1',
        name: 'test D',
      },
      {
        id: '2',
        name: 'test E',
      },
      {
        id: '3',
        name: 'test F',
      },
      {
        id: '4',
        name: 'test A',
      },
      {
        id: '5',
        name: 'test B',
      },
      {
        id: '6',
        name: 'test C',
      },
    ])
  })
})
