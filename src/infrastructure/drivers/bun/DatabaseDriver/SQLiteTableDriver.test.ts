import { Database } from 'bun:sqlite'
import { SQLiteDatabaseTableDriver } from './SQLiteTableDriver'
import type { IDatabaseTableDriver } from '@adapter/spi/drivers/DatabaseTableSpi'
import { testDatabaseTableDriver } from '../../shared/DatabaseDriver/test'
import BunTester from 'bun:test'

const setup = async (): Promise<IDatabaseTableDriver> => {
  // GIVEN
  const db = new Database()
  const bunTable = new SQLiteDatabaseTableDriver(
    'table_1',
    [
      {
        name: 'name',
        type: 'TEXT',
      },
    ],
    db
  )
  return bunTable
}

testDatabaseTableDriver(BunTester, setup)
