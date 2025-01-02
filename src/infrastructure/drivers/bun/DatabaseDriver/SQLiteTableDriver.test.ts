import { Database } from 'bun:sqlite'
import { SQLiteDatabaseTableDriver } from './SQLiteTableDriver'
import type { IDatabaseTableDriver } from '@adapter/spi/drivers/DatabaseTableSpi'
import { testDatabaseTableDriver } from '../../shared/DatabaseDriver/test'
import runner from 'bun:test'

const setup = async (date: Date): Promise<IDatabaseTableDriver> => {
  // GIVEN
  const db = new Database()
  const bunTable = new SQLiteDatabaseTableDriver(
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

  return bunTable
}

testDatabaseTableDriver(runner, setup)
