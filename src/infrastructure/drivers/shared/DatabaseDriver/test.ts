import type { IDatabaseTableDriver } from '@adapter/spi/drivers/DatabaseTableSpi'
import BunTester from 'bun:test'

export function testDatabaseTableDriver(
  { describe, beforeAll, afterAll, it, expect }: typeof BunTester,
  setup: () => Promise<IDatabaseTableDriver>,
  teardown?: () => Promise<void>
) {
  let databaseTable: IDatabaseTableDriver
  const date = new Date()

  beforeAll(async () => {
    databaseTable = await setup()
  })

  afterAll(async () => {
    if (teardown) await teardown()
  })

  describe('create', () => {
    it('should create a table', async () => {
      // THEN
      await databaseTable.create()
    })

    it('should not create a table if already exist', async () => {
      // THEN
      expect(databaseTable.create()).rejects.toThrowError('Table "table_1" already exists')
    })

    it('should have an "id" fields', async () => {
      // WHEN
      const id = databaseTable.fields.find((field) => field.name === 'id')

      // THEN
      expect(id).toStrictEqual({
        name: 'id',
        type: 'TEXT',
        required: true,
      })
    })

    it('should have an "created_at" fields', async () => {
      // WHEN
      const createdAt = databaseTable.fields.find((field) => field.name === 'created_at')

      // THEN
      expect(createdAt).toStrictEqual({
        name: 'created_at',
        type: 'TIMESTAMP',
        required: true,
      })
    })

    it('should have an "updated_at" fields', async () => {
      // WHEN
      const updatedAt = databaseTable.fields.find((field) => field.name === 'updated_at')

      // THEN
      expect(updatedAt).toStrictEqual({
        name: 'updated_at',
        type: 'TIMESTAMP',
      })
    })
  })

  describe('createView', () => {
    it('should create a view', async () => {
      // THEN
      expect(databaseTable.createView()).resolves
    })

    it('should not create a view if already exist', async () => {
      // THEN
      expect(databaseTable.createView()).rejects.toThrowError('View "table_1_view" already exists')
    })
  })

  describe('insert', () => {
    it('should insert a row', async () => {
      // WHEN
      await databaseTable.insert<{ name: string }>({
        id: '1',
        fields: { name: 'John' },
        created_at: date,
      })
    })
  })

  describe('update', () => {
    it('should update a row', async () => {
      // WHEN
      await databaseTable.update<{ name: string }>({
        id: '1',
        fields: { name: 'John Doe' },
        updated_at: date,
      })
    })
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
