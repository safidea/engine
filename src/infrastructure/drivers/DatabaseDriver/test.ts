import type { IDatabaseTableDriver } from '@adapter/spi/drivers/DatabaseTableSpi'
import BunTest, { afterAll } from 'bun:test'

export function testDatabaseTableDriver(
  { describe, beforeAll, it, expect }: typeof BunTest,
  setup: (date: Date) => Promise<IDatabaseTableDriver>,
  teardown?: () => Promise<void>
) {
  let databaseTable: IDatabaseTableDriver
  const date = new Date()

  beforeAll(async () => {
    databaseTable = await setup(date)
  })

  afterAll(async () => {
    if (teardown) await teardown()
  })

  describe('read', () => {
    it('should return a row with a filter', async () => {
      // WHEN
      const row = await databaseTable.read({
        field: 'name',
        operator: 'Is',
        value: 'John Doe',
      })

      // THEN
      expect(row).toStrictEqual({
        id: '1',
        fields: { name: 'John Doe' },
        created_at: date,
        updated_at: date,
      })
    })

    it('should not return a row with an empty "or" filter', async () => {
      // WHEN
      const row = await databaseTable.read({ or: [] })

      // THEN
      expect(row).toBeUndefined()
    })

    it('should not return a row with an empty "and" filter', async () => {
      // WHEN
      const row = await databaseTable.read({ and: [] })

      // THEN
      expect(row).toBeUndefined()
    })

    it('should not return a row with a filter', async () => {
      // WHEN
      const row = await databaseTable.read({
        field: 'name',
        operator: 'Is',
        value: 'Jane Doe',
      })

      // THEN
      expect(row).toBeUndefined()
    })

    it('should not return a row', async () => {
      // WHEN
      const row = await databaseTable.read({
        field: 'name',
        operator: 'Is',
        value: 'Jane Doe',
      })

      // THEN
      expect(row).toBeUndefined()
    })
  })

  describe('list', () => {
    it('should return a list of rows with no filter', async () => {
      // WHEN
      const rows = await databaseTable.list()

      // THEN
      expect(rows).toStrictEqual([
        {
          id: '1',
          fields: { name: 'John Doe' },
          created_at: date,
          updated_at: date,
        },
      ])
    })

    it('should return a list of rows with an empty "or" filter', async () => {
      // WHEN
      const rows = await databaseTable.list({ or: [] })

      // THEN
      expect(rows).toHaveLength(1)
    })

    it('should return a list of rows with an empty "and" filter', async () => {
      // WHEN
      const rows = await databaseTable.list({ and: [] })

      // THEN
      expect(rows).toHaveLength(1)
    })

    it('should return an empty list of rows with a filter', async () => {
      // WHEN
      const rows = await databaseTable.list({
        field: 'name',
        operator: 'Is',
        value: 'Jane Doe',
      })

      // THEN
      expect(rows).toHaveLength(0)
    })
  })
}
