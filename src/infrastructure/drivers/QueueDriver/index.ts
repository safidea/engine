import type { IQueueDriver } from '@adapter/spi/drivers/QueueSpi'
import type { QueueConfig } from '@domain/services/Queue'
import { SqliteDriver } from './SqliteDriver'
import { PostgresDriver } from './PostgresDriver'

export class QueueDriver implements IQueueDriver {
  private _queue: PostgresDriver | SqliteDriver

  constructor({ driver, query, exec }: QueueConfig) {
    switch (driver) {
      case 'PostgreSQL':
        this._queue = new PostgresDriver(query)
        break
      case 'SQLite':
        this._queue = new SqliteDriver(query, exec)
        break
      default:
        throw new Error('Invalid driver')
    }
  }

  onError = (callback: (error: Error) => void) => {
    this._queue.onError(callback)
  }

  start = async () => {
    await this._queue.start()
  }

  stop = async ({ graceful }: { graceful: boolean }) => {
    await this._queue.stop({ graceful })
  }

  add = async <D extends object>(job: string, data: D, options?: { retry: number }) => {
    await this._queue.add(job, data, options)
  }

  job = async <D extends object>(
    queue: string,
    callback: (id: string, data: D) => Promise<void>
  ) => {
    await this._queue.job(queue, callback)
  }

  waitForEmpty = async (name: string, timeout: number) => {
    return this._queue.waitForEmpty(name, timeout)
  }
}
