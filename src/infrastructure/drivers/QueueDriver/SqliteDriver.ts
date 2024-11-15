import type { IQueueDriver } from '@adapter/spi/drivers/QueueSpi'
import type { QueueConfig } from '@domain/services/Queue'
import type { JobDto } from '@adapter/spi/dtos/JobDto'
import { v4 as uuidv4 } from 'uuid'
import { EventEmitter } from 'events'

interface Job {
  id: string
  name: string
  data: string
  state: JobDto['state']
  retryCount: number
}

export class SqliteDriver implements IQueueDriver {
  private _intervalsQueues: Timer[] = []
  private _emitter: EventEmitter
  private _jobIds: { job: string; id: string }[] = []

  constructor(
    private _query: QueueConfig['query'],
    private _exec: QueueConfig['exec']
  ) {
    this._emitter = new EventEmitter()
  }

  onError = (callback: (error: Error) => void) => {
    this._emitter.on('error', callback)
  }

  start = async (): Promise<void> => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS _jobs (
        id TEXT PRIMARY KEY,
        name TEXT,
        data TEXT,
        state TEXT,
        retryCount INTEGER
      )
    `
    await this._exec(createTableQuery)
  }

  stop = async (): Promise<void> => {
    this._intervalsQueues.forEach((interval) => clearInterval(interval))
  }

  add = async <D extends object>(
    job: string,
    data: D,
    option?: { retry?: number }
  ): Promise<void> => {
    const { retry = 0 } = option || {}
    const id = uuidv4()
    const insertQuery = `
      INSERT INTO _jobs (id, name, data, state, retrycount)
      VALUES (?, ?, ?, 'created', ?)
    `
    await this._query(insertQuery, [id, job, JSON.stringify(data), retry])
    this._jobIds.push({ job, id })
  }

  job = async <D extends object>(
    name: string,
    callback: (id: string, data: D) => Promise<void>
  ) => {
    const interval = setInterval(async () => {
      const selectQuery = `
        SELECT * FROM _jobs
        WHERE name = ? AND state IN ('created', 'retry')
        LIMIT 1
      `
      const {
        rows: [job],
      } = await this._query<Job>(selectQuery, [name])
      if (job) {
        try {
          const updateActiveQuery = `
            UPDATE _jobs
            SET state = 'active', retrycount = ?
            WHERE id = ?
          `
          await this._query(updateActiveQuery, [job.retryCount, job.id])
          const data = JSON.parse(job.data)
          await callback(job.id, data)
          const updateCompletedQuery = `
            UPDATE _jobs
            SET state = 'completed', retrycount = 0
            WHERE id = ?
          `
          await this._query(updateCompletedQuery, [job.id])
          const jobIndex = this._jobIds.findIndex(({ id }) => id === job.id)
          if (jobIndex !== -1) {
            this._jobIds.splice(jobIndex, 1)
          }
        } catch (error) {
          console.error(error)
          if (job.retryCount > 0) {
            const updateRetryQuery = `
              UPDATE _jobs
              SET state = 'retry', retrycount = ?
              WHERE id = ?
            `
            await this._query(updateRetryQuery, [job.retryCount - 1, job.id])
          } else {
            const updateFailedQuery = `
              UPDATE _jobs
              SET state = 'failed', retrycount = 0
              WHERE id = ?
            `
            await this._query(updateFailedQuery, [job.id])
          }
        }
      }
    }, 500)
    this._intervalsQueues.push(interval)
  }

  waitForEmpty = async (name: string, timeout: number) => {
    const timeoutPromise = new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(false), timeout)
    )
    const waiterPromise = new Promise<boolean>((resolve) => {
      const interval = setInterval(async () => {
        const selectQuery = `
          SELECT * FROM _jobs
          WHERE name = ? AND state IN ('created', 'retry')
          LIMIT 1
        `
        const {
          rows: [runningJob],
        } = await this._query<Job>(selectQuery, [name])
        if (!runningJob) {
          clearInterval(interval)
          resolve(true)
        }
      }, 500)
    })
    return Promise.race([waiterPromise, timeoutPromise])
  }
}
