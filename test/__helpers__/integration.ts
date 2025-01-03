import BunApp, { type Config } from './app/bun'
import { join } from 'path'
import { nanoid } from 'nanoid'
import fs from 'fs-extra'
import { DatabaseDriver } from '@infrastructure/drivers/bun/DatabaseDriver'
import { StorageDriver } from '@infrastructure/drivers/shared/StorageDriver'
import { NotionIntegration } from '@infrastructure/integrations/mocks/bun/NotionIntegration'
import { QontoIntegration } from '@infrastructure/integrations/mocks/bun/QontoIntegration'
import { PappersIntegration } from '@infrastructure/integrations/mocks/bun/PappersIntegration'
import type { DatabaseConfig } from '@domain/services/Database'
import type { StartedApp } from '@latechforce/engine'

type Tester = {
  describe: (message: string, tests: () => void) => void
  beforeEach: (fn: () => Promise<void>) => void
  afterEach: (fn: () => Promise<void>) => void
}

type DriverType = 'Database' | 'Storage'
type IntegrationType = 'Notion' | 'Qonto' | 'Pappers'

// Generic definitions for drivers
type WithDriverInput<D extends DriverType[]> = { drivers: D }
type WithDriverOutput<D extends DriverType> = D extends 'Database'
  ? { database: DatabaseDriver }
  : D extends 'Storage'
    ? { storage: StorageDriver }
    : never

// Generic definitions for integrations
type WithIntegrationInput<I extends IntegrationType[]> = { integrations: I }
type WithIntegrationOutput<I extends IntegrationType> = I extends 'Notion'
  ? { notion: NotionIntegration }
  : I extends 'Qonto'
    ? { qonto: QontoIntegration }
    : I extends 'Pappers'
      ? { pappers: PappersIntegration }
      : never

// Combine multiple outputs
type CombineOutputs<Keys extends IntegrationType[]> = Keys extends [infer First, ...infer Rest]
  ? First extends IntegrationType
    ? Rest extends IntegrationType[]
      ? WithIntegrationOutput<First> & CombineOutputs<Rest>
      : WithIntegrationOutput<First>
    : never
  : {}

type WithOptions<D extends DriverType[] = [], I extends IntegrationType[] = []> =
  | WithDriverInput<D>
  | WithIntegrationInput<I>
  | (WithDriverInput<D> & WithIntegrationInput<I>)

type Request = {
  get: (url: string) => Promise<any>
  post: (url: string, body: unknown) => Promise<any>
}
type TestApp = {
  start: (_: Config) => Promise<StartedApp>
}

export class IntegrationTest {
  constructor(private tester: Tester) {}

  get request(): Request {
    return {
      get: async (url: string) => {
        return fetch(url)
          .then((res) => res.json())
          .catch((error) => {
            console.error(error)
            return error
          })
      },
      post: async (url: string, body: unknown) => {
        return fetch(url, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res) => res.json())
          .catch((error) => {
            console.error(error)
            return error
          })
      },
    }
  }

  with<D extends DriverType[] = [], I extends IntegrationType[] = []>(
    options: WithOptions<D, I>,
    tests: (helper: {
      app: TestApp
      request: Request
      drivers: D extends (infer U)[] ? (U extends DriverType ? WithDriverOutput<U> : never) : {}
      integrations: CombineOutputs<I>
    }) => void
  ): void {
    let message = 'with'
    if ('drivers' in options && options.drivers.length > 0) {
      message += ` ${options.drivers.join(', ')} driver(s)`
    }
    if (
      'drivers' in options &&
      options.drivers.length > 0 &&
      'integrations' in options &&
      options.integrations.length > 0
    ) {
      message += ' and'
    }
    if ('integrations' in options && options.integrations.length > 0) {
      message += ` ${'integrations' in options && options.integrations.join(', ')} integration(s)`
    }

    this.tester.describe(message, () => {
      const drivers: any = {}
      const integrations: any = {}
      const extendsConfig: Partial<Config> = {}
      const app: TestApp = {
        start: async (_: Config): Promise<StartedApp> => {
          throw new Error('App must be initialized before starting')
        },
      }

      this.tester.beforeEach(async () => {
        if ('drivers' in options && options.drivers?.includes('Database')) {
          const url = join(process.cwd(), 'tmp', `database-${nanoid()}.db`)
          await fs.ensureFile(url)
          const config: DatabaseConfig = { driver: 'SQLite', url }
          const database = new DatabaseDriver(config)
          drivers.database = database
          extendsConfig.database = config
        }
        if ('drivers' in options && options.drivers?.includes('Storage')) {
          if (!drivers.database) {
            throw new Error('Database must be initialized before Storage')
          }
          drivers.storage = new StorageDriver(drivers.database)
        }
        if ('integrations' in options && options.integrations?.includes('Notion')) {
          integrations.notion = new NotionIntegration()
        }
        if ('integrations' in options && options.integrations?.includes('Qonto')) {
          integrations.qonto = new QontoIntegration()
        }
        if ('integrations' in options && options.integrations?.includes('Pappers')) {
          integrations.pappers = new PappersIntegration()
        }

        app.start = async (config: Config) => {
          return new BunApp().start({ ...config, ...extendsConfig })
        }
      })

      this.tester.afterEach(async () => {
        if (
          'drivers' in options &&
          options.drivers?.includes('Database') &&
          extendsConfig.database?.url
        ) {
          await fs.remove(extendsConfig.database.url)
        }
      })

      tests({
        drivers,
        integrations,
        request: this.request,
        app,
      })
    })
  }
}

export type { Config }
