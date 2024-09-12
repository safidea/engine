import { nanoid } from 'nanoid'
import { join } from 'path'
import fs from 'fs-extra'
import Logger from './logger'
import { DatabaseDriver } from '@infrastructure/drivers/DatabaseDriver'
import type { Config, Driver } from '@domain/services/Database'
import type { Test } from './fixtures'
import pg from 'pg'
import { customAlphabet } from 'nanoid'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'

async function checkDatabaseAvailability(client: pg.Client): Promise<boolean> {
  try {
    await client.query('SELECT 1')
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

async function createDatabase(connectionURI: string, dbName: string): Promise<string> {
  const client = new pg.Client({ connectionString: connectionURI })
  await client.connect()
  await client.query(`CREATE DATABASE ${dbName}`)
  const newConnectionURI = connectionURI.replace(/\/[^/]+$/, `/${dbName}`)
  let attempts = 0
  const maxAttempts = 5
  const delay = 1000 // 1 second delay between attempts
  while (attempts < maxAttempts) {
    if (await checkDatabaseAvailability(client)) {
      break
    }
    attempts++
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
  await client.end()
  if (attempts === maxAttempts) {
    throw new Error(`Database ${dbName} is not available after ${maxAttempts} attempts`)
  }
  return newConnectionURI
}

async function dropDatabase(connectionURI: string, dbName: string): Promise<void> {
  const client = new pg.Client({ connectionString: connectionURI })
  await client.connect()
  const terminateQuery = `
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = $1
      AND pid <> pg_backend_pid();
  `
  await client.query(terminateQuery, [dbName])
  await client.query(`DROP DATABASE IF EXISTS ${dbName}`)
  await client.end()
}

export default class Database extends DatabaseDriver {
  public url: string
  public driver: Driver

  constructor(config: Config) {
    super(config)
    if (config.driver !== 'SQLite' && config.driver !== 'PostgreSQL')
      throw new Error(`unsupported database type: ${config.driver}`)
    this.url = config.url
    this.driver = config.driver
  }

  table(name: string, fields: FieldDto[] = []) {
    return super.table(name, [
      {
        name: 'id',
        type: 'TEXT',
        required: true,
      },
      {
        name: 'name',
        type: 'TEXT',
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        required: true,
      },
      {
        name: 'updated_at',
        type: 'TIMESTAMP',
      },
      ...fields,
    ])
  }

  static each(test: Test, callback: (config: Config) => void) {
    const logger = new Logger()
    const log = logger.init('[test]:database')
    for (const driver of ['SQLite', 'PostgreSQL']) {
      const config: Config = { url: '', driver }
      test.describe(`with "${driver}" database`, () => {
        if (driver === 'SQLite') {
          test.beforeEach(async () => {
            config.url = join(process.cwd(), 'tmp', `database-${nanoid()}.db`)
            await fs.ensureFile(config.url)
            log(`start "${driver}" database at ${config.url}`)
          })
          test.afterEach(async () => {
            log(`stop "${driver}" database at ${config.url}`)
            await fs.remove(config.url)
          })
          callback(config)
        } else if (driver === 'PostgreSQL') {
          const dbName = `test_db_${customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)()}`
          const postgresUrl = process.env.TEST_POSTGRES_URL || ''
          test.beforeEach(async () => {
            config.url = await createDatabase(postgresUrl, dbName)
            log(`start "${driver}" database at ${config.url}`)
          })
          test.afterEach(async () => {
            log(`stop "${driver}" database at ${config.url}`)
            await dropDatabase(postgresUrl, dbName)
          })
          callback(config)
        } else {
          throw new Error(`unsupported database type: ${driver}`)
        }
      })
    }
  }
}
