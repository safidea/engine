import type { Exec, Query } from './Database'
import type { Logger } from './Logger'
import type { Context } from '@domain/entities/Automation/Context'

export interface Config {
  type: 'sqlite' | 'postgres'
  query: Query
  exec: Exec
}

export interface Services {
  logger: Logger
}

export type State =
  | 'retry'
  | 'created'
  | 'active'
  | 'completed'
  | 'expired'
  | 'cancelled'
  | 'failed'
  | 'archive'

export interface Spi {
  onError: (callback: (error: Error) => void) => void
  start: () => Promise<void>
  stop: (options: { graceful: boolean }) => Promise<void>
  add: (job: string, data: object, options?: { retry: number }) => Promise<void>
  job: (job: string, callback: (id: string, data: object) => Promise<void>) => Promise<void>
  waitForEmpty: (name: string, timeout: number) => Promise<boolean>
}

export class Queue {
  private _log: (message: string) => void
  private _jobs: {
    name: string
    callback: (id: string, data: object) => Promise<void>
  }[] = []

  constructor(
    private _spi: Spi,
    services: Services
  ) {
    this._log = services.logger.init('queue')
  }

  onError = () => {
    this._spi.onError((error: Error) => {
      this._log(`queue error: ${error.message}`)
    })
  }

  start = async () => {
    this._log('starting queue...')
    await this._spi.start()
    for (const { name, callback } of this._jobs) {
      await this._spi.job(name, callback)
    }
    this._log('queue started')
  }

  stop = async (options: { graceful: boolean }) => {
    try {
      this._log('stopping queue...')
      await this._spi.stop(options)
    } catch (error) {
      if (error instanceof Error) this._log(`error stopping queue: ${error.message}`)
    }
  }

  add = async <D extends object>(
    job: string,
    data: D,
    options?: { retry: number }
  ): Promise<void> => {
    this._log(`add job "${job}" to queue`)
    await this._spi.add(job, data, options)
  }

  job = (name: string, initCallback: (data: object) => Promise<Context>) => {
    this._jobs.push({
      name,
      callback: async (id: string, data: object) => {
        this._log(`job "${name}" with id ${id} started`)
        await initCallback(data)
        this._log(`job "${name}" with id ${id} finished`)
      },
    })
  }

  waitForEmpty = async (name: string, timeout = 5000) => {
    this._log(`waiting for empty queue "${name}"...`)
    return this._spi.waitForEmpty(name, timeout)
  }
}
