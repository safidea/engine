import { SQLiteDatabaseTableDriver } from './SQLiteTableDriver'
import type { Database as SQLiteDatabase } from 'better-sqlite3'
import { Database } from 'bun:sqlite'
import type { IDatabaseTableDriver } from '@adapter/spi/drivers/DatabaseTableSpi'
import { testDatabaseTableDriver } from '../../shared/DatabaseDriver/test'
import BunTester from 'bun:test'

const setup = async (): Promise<IDatabaseTableDriver> => {
  // GIVEN
  const db = new Database() as unknown as SQLiteDatabase
  const sqliteTable = new SQLiteDatabaseTableDriver(
    'table_1',
    [
      {
        name: 'name',
        type: 'TEXT',
      },
    ],
    db
  )
  return sqliteTable
}

testDatabaseTableDriver(BunTester, setup)
