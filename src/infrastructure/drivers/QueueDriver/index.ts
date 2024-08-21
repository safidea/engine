import type { Driver } from '@adapter/spi/QueueSpi'
import type { Config } from '@domain/services/Queue'
import { SqliteDriver } from './SqliteDriver'
import { PostgresDriver } from './PostgresDriver'

export class QueueDriver implements Driver {
  private _queue: PostgresDriver | SqliteDriver

  constructor({ type, query, exec }: Config) {
    if (type === 'sqlite') {
      this._queue = new SqliteDriver(query, exec)
    } else if (type === 'postgres') {
      this._queue = new PostgresDriver(query)
    } else {
      throw new Error(`Database ${type} not supported`)
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
