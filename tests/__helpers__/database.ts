import { nanoid } from 'nanoid'
import { join } from 'path'
import fs from 'fs-extra'
import Logger from './logger'
import { DatabaseDriver } from '@infrastructure/drivers/DatabaseDriver'
import type { Config } from '@domain/services/Database'
import type {
  TestType,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
} from '@playwright/test'
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql'

export default class extends DatabaseDriver {
  public url: string
  public type: 'sqlite' | 'postgres'

  constructor(config: Config) {
    super(config)
    if (config.type !== 'sqlite' && config.type !== 'postgres')
      throw new Error(`unsupported database type: ${config.type}`)
    this.url = config.url
    this.type = config.type
  }

  static each(
    test: TestType<
      PlaywrightTestArgs & PlaywrightTestOptions,
      PlaywrightWorkerArgs & PlaywrightWorkerOptions
    >,
    callback: (config: Config) => void
  ) {
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
          let postgresContainer: StartedPostgreSqlContainer
          test.beforeEach(async () => {
            postgresContainer = await new PostgreSqlContainer().start()
            config.url = postgresContainer.getConnectionUri()
            log(`start "${type}" database at ${config.url}`)
          })
          test.afterEach(async () => {
            log(`stop "${type}" database at ${config.url}`)
            await postgresContainer.stop()
          })
          callback(config)
        } else {
          throw new Error(`unsupported database type: ${type}`)
        }
      })
    }
  }
}
