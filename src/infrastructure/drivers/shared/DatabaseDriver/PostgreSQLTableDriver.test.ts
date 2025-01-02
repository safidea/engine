import pg from 'pg'
import runner from 'bun:test'
import type { IDatabaseTableDriver } from '@adapter/spi/drivers/DatabaseTableSpi'
import { testDatabaseTableDriver } from './test'
import { PostgreSQLDatabaseTableDriver } from './PostgreSQLTableDriver'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'

let container: StartedPostgreSqlContainer

const setup = async (date: Date): Promise<IDatabaseTableDriver> => {
  // GIVEN
  container = await new PostgreSqlContainer().start()
  const url = container.getConnectionUri()
  const db = new pg.Pool({ connectionString: url })
  const NUMERIC_OID = 1700
  db.on('error', () => {})
  db.on('connect', (client) => {
    client.on('error', () => {})
    client.setTypeParser(NUMERIC_OID, (value) => parseFloat(value))
  })
  const postgreSQLTable = new PostgreSQLDatabaseTableDriver(
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
  await db.connect()
  await db.query(
    'CREATE TABLE table_1 (id TEXT PRIMARY KEY, name TEXT, created_at TIMESTAMP, updated_at TIMESTAMP)'
  )
  await db.query('CREATE VIEW table_1_view AS SELECT * FROM table_1')
  await db.query('INSERT INTO table_1 (id, name, created_at, updated_at) VALUES ($1, $2, $3, $4)', [
    '1',
    'John Doe',
    date,
    date,
  ])
  return postgreSQLTable
}

const teardown = async () => {
  await container.stop()
}

testDatabaseTableDriver(runner, setup, teardown)
