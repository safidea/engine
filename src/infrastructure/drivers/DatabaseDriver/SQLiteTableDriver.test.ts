import { describe, it, expect, beforeAll } from 'bun:test'
import { SQLiteTableDriver } from './SQLiteTableDriver'
import type { Database as SQLiteDatabase } from 'better-sqlite3'
import { Database } from 'bun:sqlite'

let sqliteTable: SQLiteTableDriver
let db: SQLiteDatabase
const date = new Date()

beforeAll(() => {
  // GIVEN
  db = new Database() as unknown as SQLiteDatabase
  sqliteTable = new SQLiteTableDriver(
    'table_1',
    [
      {
        name: 'id',
        type: 'TEXT',
      },
      {
        name: 'name',
        type: 'TEXT',
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
      },
      {
        name: 'updated_at',
        type: 'TIMESTAMP',
      },
    ],
    db
  )
  db.exec(
    'CREATE TABLE table_1 (id TEXT PRIMARY KEY, name TEXT, created_at TIMESTAMP, updated_at TIMESTAMP)'
  )
  db.exec('CREATE VIEW table_1_view AS SELECT * FROM table_1')
  db.prepare('INSERT INTO table_1 (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)').run(
    '1',
    'John Doe',
    date.getTime(),
    date.getTime()
  )
})

describe('read', () => {
  it('should return a row with a filter', async () => {
    // WHEN
    const row = await sqliteTable.read({
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
    const row = await sqliteTable.read({ or: [] })

    // THEN
    expect(row).toBeUndefined()
  })

  it('should not return a row with an empty "and" filter', async () => {
    // WHEN
    const row = await sqliteTable.read({ and: [] })

    // THEN
    expect(row).toBeUndefined()
  })

  it('should not return a row with a filter', async () => {
    // WHEN
    const row = await sqliteTable.read({
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
    const rows = await sqliteTable.list()

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
    const rows = await sqliteTable.list({ or: [] })

    // THEN
    expect(rows).toHaveLength(1)
  })

  it('should return a list of rows with an empty "and" filter', async () => {
    // WHEN
    const rows = await sqliteTable.list({ and: [] })

    // THEN
    expect(rows).toHaveLength(1)
  })

  it('should return an empty list of rows with a filter', async () => {
    // WHEN
    const rows = await sqliteTable.list({
      field: 'name',
      operator: 'Is',
      value: 'Jane Doe',
    })

    // THEN
    expect(rows).toHaveLength(0)
  })
})
