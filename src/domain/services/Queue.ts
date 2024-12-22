import type { DatabaseExec, DatabaseQuery, DatabaseDriverName, Database } from './Database'
import type { Logger } from './Logger'
import type { AutomationContext } from '@domain/entities/Automation/Context'
import type { Monitor } from './Monitor'

export interface QueueConfig {
  driver: DatabaseDriverName
  query: DatabaseQuery
  exec: DatabaseExec
}

export interface QueueServices {
  logger: Logger
  monitor: Monitor
  database: Database
}

export type QueueState =
  | 'retry'
  | 'created'
  | 'active'
  | 'completed'
  | 'expired'
  | 'cancelled'
  | 'failed'
  | 'archive'

export interface IQueueSpi {
  onError: (callback: (error: Error) => void) => void
  start: () => Promise<void>
  stop: (options: { graceful: boolean }) => Promise<void>
  add: (job: string, data: object, options?: { retry: number }) => Promise<void>
  job: (job: string, callback: (id: string, data: object) => Promise<void>) => Promise<void>
  waitForEmpty: (name: string, timeout: number) => Promise<boolean>
}

export class Queue {
  private _jobs: {
    name: string
    callback: (id: string, data: object) => Promise<void>
  }[] = []

  constructor(
    private _spi: IQueueSpi,
    private _services: QueueServices
  ) {}

  onError = () => {
    const { monitor, logger } = this._services
    logger.debug(`listening for queue error...`)
    this._spi.onError((error: Error) => {
      logger.error(`queue: ${error.message}`)
      monitor.captureException(error)
    })
  }

  start = async () => {
    const { logger } = this._services
    logger.debug('starting queue...')
    await this._spi.start()
    for (const { name, callback } of this._jobs) {
      await this._spi.job(name, callback)
    }
  }

  stop = async (options: { graceful: boolean }) => {
    const { monitor, logger } = this._services
    try {
      logger.debug('stopping queue...')
      await this._spi.stop(options)
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`when stopping queue: ${error.message}`)
        monitor.captureException(error)
      } else throw error
    }
  }

  add = async <D extends object>(
    job: string,
    data: D,
    options?: { retry: number }
  ): Promise<void> => {
    this._services.logger.debug(`add job "${job}" to queue`, data)
    await this._spi.add(job, data, options)
  }

  job = (name: string, initCallback: (data: object) => Promise<AutomationContext>) => {
    const { logger } = this._services
    this._jobs.push({
      name,
      callback: async (id: string, data: object) => {
        logger.debug(`job "${name}" with id ${id} started`, data)
        await initCallback(data)
        logger.debug(`job "${name}" with id ${id} finished`, data)
      },
    })
  }

  waitForEmpty = async (name: string, timeout = 5000) => {
    this._services.logger.debug(`waiting for empty queue "${name}"...`)
    return this._spi.waitForEmpty(name, timeout)
  }
}
