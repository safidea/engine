import { nanoid } from 'nanoid'
import { join } from 'path'
import fs from 'fs-extra'
import Logger from './logger'
import { DatabaseDriver } from '@infrastructure/drivers/DatabaseDriver'
import type { Config } from '@domain/services/Database'
import type { Test } from './fixtures'
import pg from 'pg'
import { customAlphabet } from 'nanoid'

async function checkDatabaseAvailability(connectionURI: string): Promise<boolean> {
  const client = new pg.Client({ connectionString: connectionURI })
  try {
    await client.connect()
    await client.query('SELECT 1')
    await client.end()
    return true
  } catch (err) {
    return false
  }
}

async function createDatabase(connectionURI: string, dbName: string): Promise<string> {
  const client = new pg.Client({ connectionString: connectionURI })
  await client.connect()
  await client.query(`CREATE DATABASE ${dbName}`)
  await client.end()
  const newConnectionURI = connectionURI.replace(/\/[^/]+$/, `/${dbName}`)
  let attempts = 0
  const maxAttempts = 5
  const delay = 1000 // 1 second delay between attempts
  while (attempts < maxAttempts) {
    if (await checkDatabaseAvailability(newConnectionURI)) {
      break
    }
    attempts++
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
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
  public type: 'sqlite' | 'postgres'

  constructor(config: Config) {
    super(config)
    if (config.type !== 'sqlite' && config.type !== 'postgres')
      throw new Error(`unsupported database type: ${config.type}`)
    this.url = config.url
    this.type = config.type
  }

  static each(test: Test, callback: (config: Config) => void) {
    const logger = new Logger()
    const log = logger.init('[test]:database')
    for (const type of ['sqlite', 'postgres']) {
      const config: Config = { url: '', type }
      test.describe(`with "${type}" database`, () => {
        if (type === 'sqlite') {
          test.beforeEach(async () => {
            config.url = join(process.cwd(), 'tmp', `database-${nanoid()}.db`)
            await fs.ensureFile(config.url)
            log(`start "${type}" database at ${config.url}`)
          })
          test.afterEach(async () => {
            log(`stop "${type}" database at ${config.url}`)
            await fs.remove(config.url)
          })
          callback(config)
        } else if (type === 'postgres') {
          const dbName = `test_db_${customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)()}`
          test.beforeEach(async ({ postgresUrl }) => {
            config.url = await createDatabase(postgresUrl, dbName)
            log(`start "${type}" database at ${config.url}`)
          })
          test.afterEach(async ({ postgresUrl }) => {
            log(`stop "${type}" database at ${config.url}`)
            await dropDatabase(postgresUrl, dbName)
          })
          callback(config)
        } else {
          throw new Error(`unsupported database type: ${type}`)
        }
      })
    }
  }
}
