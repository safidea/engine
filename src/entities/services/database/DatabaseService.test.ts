import { describe, test, expect } from '@specs/utils/unit/fixtures'
import { DatabaseService } from './DatabaseMapper'
import { Table } from '@entities/app/table/Table'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'

describe('DatabaseService', () => {
  test('should emit event "record_created" with calculated formulas', async () => {
    // GIVEN
    const events: any[] = []
    const emit = async (event: any) => {
      events.push(event)
    }
    const table = new Table(
      {
        name: 'users',
        fields: [
          { name: 'name', type: 'single_line_text' },
          { name: 'autonumber', type: 'autonumber' },
          { name: 'index', type: 'formula', formula: 'autonumber + 1000' },
        ],
      },
      {} as any
    )
    const record = new RecordToCreate({ name: 'John' }, table)
    const databaseService = new DatabaseService({
      create: () => {
        return Promise.resolve({ ...record.data(), autonumber: 1 })
      },
    } as any)
    await databaseService.listen(emit)

    // WHEN
    const id = await databaseService.create(table, record)

    // THEN
    expect(id).toEqual(record.id)
    expect(events[0].context.record.index).toEqual(1001)
  })

  test('should emit many events "record_created"', async () => {
    // GIVEN
    const events: any[] = []
    const emit = async (event: any) => {
      events.push(event)
    }
    const table = new Table(
      {
        name: 'users',
        fields: [{ name: 'name', type: 'single_line_text' }],
      },
      {} as any
    )
    const recordA = new RecordToCreate({ name: 'John' }, table)
    const recordB = new RecordToCreate({ name: 'Jane' }, table)
    const databaseService = new DatabaseService({
      createMany: () => {
        return Promise.resolve([recordA.data(), recordB.data()])
      },
    } as any)
    await databaseService.listen(emit)

    // WHEN
    const ids = await databaseService.createMany(table, [recordA, recordB])

    // THEN
    expect(ids).toEqual([recordA.id, recordB.id])
    expect(events.length).toEqual(2)
    expect(events[0].event).toEqual('record_created')
    expect(events[0].context.table).toEqual('users')
    expect(events[1].event).toEqual('record_created')
    expect(events[1].context.table).toEqual('users')
  })
})
