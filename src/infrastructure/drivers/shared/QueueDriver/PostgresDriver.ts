import type { IQueueDriver } from '@adapter/spi/drivers/QueueSpi'
import type { QueueConfig } from '@domain/services/Queue'
import PgBoss from 'pg-boss'

export class PostgresDriver implements IQueueDriver {
  private _queue: PgBoss

  constructor(query: QueueConfig['query']) {
    this._queue = new PgBoss({
      db: {
        executeSql: async (text, values) => query(text, values),
      },
      schema: 'queue',
    })
  }

  onError = (callback: (error: Error) => void) => {
    this._queue.on('error', callback)
  }

  start = async () => {
    await this._queue.start()
  }

  stop = async ({ graceful }: { graceful: boolean }) => {
    await this._queue.stop({ graceful })
  }

  add = async <D extends object>(name: string, data: D, options?: { retry: number }) => {
    const { retry = 0 } = options || {}
    await this._queue.send(name, data, {
      retryLimit: retry,
    })
  }

  job = async <D extends object>(
    name: string,
    callback: (id: string, data: D) => Promise<void>
  ) => {
    await this._queue.createQueue(name)
    await this._queue.work(name, async ([job]: PgBoss.Job<D>[]) => {
      await callback(job.id, job.data)
    })
  }

  waitForEmpty = async (name: string, timeout: number) => {
    const timeoutPromise = new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(false), timeout)
    )
    const waiterPromise = new Promise<boolean>((resolve) => {
      const interval = setInterval(async () => {
        const [job] = await this._queue.fetch(name)
        if (!job) {
          clearInterval(interval)
          resolve(true)
        }
      }, 500)
    })
    return Promise.race([waiterPromise, timeoutPromise])
  }
}
