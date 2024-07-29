import type { Driver } from '@adapter/spi/QueueSpi'
import type { Config, WaitForParams } from '@domain/services/Queue'
import PgBoss from 'pg-boss'
import { v4 as uuidv4 } from 'uuid'
import { EventEmitter } from 'events'
import type { JobDto } from '@adapter/spi/dtos/JobDto'

export class QueueDriver implements Driver {
  private _boss: PgBoss | SqliteBoss
  private _jobIds: { job: string; id: string }[] = []

  constructor({ type, query, exec }: Config) {
    if (type === 'sqlite') {
      this._boss = new SqliteBoss(query, exec)
    } else if (type === 'postgres') {
      this._boss = new PgBoss({
        db: {
          executeSql: async (text, values) => query(text, values),
        },
        schema: 'queue',
      })
    } else {
      throw new Error(`Database ${type} not supported`)
    }
  }

  onError = (callback: (error: Error) => void) => {
    this._boss.on('error', callback)
  }

  start = async () => {
    await this._boss.start()
  }

  stop = async ({ graceful }: { graceful: boolean }) => {
    await this._boss.stop({ graceful })
    if (graceful)
      await new Promise((resolve) => {
        this._boss.on('stopped', () => resolve(null))
      })
  }

  add = async <D extends object>(job: string, data: D, options?: { retry: number }) => {
    const { retry = 0 } = options || {}
    const id = await this._boss.send(job, data, {
      retryLimit: retry,
    })
    if (!id) {
      throw new Error('Failed to send job')
    }
    this._jobIds.push({ job, id })
    return id
  }

  job = <D extends object>(name: string, callback: (id: string, data: D) => Promise<void>) => {
    this._boss.work(name, async (job: PgBoss.Job<D>) => {
      await callback(job.id, job.data)
      const jobIndex = this._jobIds.findIndex(({ id }) => id === job.id)
      if (jobIndex !== -1) {
        this._jobIds.splice(jobIndex, 1)
      }
    })
  }

  getById = async (id: string): Promise<JobDto | undefined> => {
    const job = await this._boss.getJobById(id)
    if (!job) return undefined
    return {
      id: job.id,
      name: job.name,
      data: job.data,
      state: job.state,
      retryCount: job.retrycount,
    }
  }

  waitFor = async ({ id, name, state, timeout = 5000 }: WaitForParams) => {
    const timeoutPromise = new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(false), timeout)
    )
    const waiterPromise = new Promise<boolean>((resolve) => {
      const interval = setInterval(async () => {
        if (id) {
          const job = await this.getById(id)
          if (job && job.state === state) {
            clearInterval(interval)
            resolve(true)
          }
        } else if (name) {
          const runningJob = await this._boss.fetch(name)
          if (!runningJob) {
            clearInterval(interval)
            resolve(true)
          }
        }
      }, 500)
    })
    return Promise.race([waiterPromise, timeoutPromise])
  }
}

interface SqliteBossJob {
  id: string
  name: string
  data: string
  state: JobDto['state']
  retrycount: number
}

class SqliteBoss {
  private _intervalsQueues: Timer[] = []
  private _emitter: EventEmitter

  constructor(
    private _query: Config['query'],
    private _exec: Config['exec']
  ) {
    this._emitter = new EventEmitter()
  }

  on = (event: 'error' | 'stopped', callback: (error: Error) => void) => {
    this._emitter.on(event, callback)
  }

  start = async (): Promise<void> => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS _jobs (
        id TEXT PRIMARY KEY,
        name TEXT,
        data TEXT,
        state TEXT,
        retrycount INTEGER
      )
    `
    await this._exec(createTableQuery)
  }

  stop = async (): Promise<void> => {
    this._intervalsQueues.forEach((interval) => clearInterval(interval))
    setTimeout(() => this._emitter.emit('stopped'), 100)
  }

  send = async <D extends object>(
    job: string,
    data: D,
    option?: { retryLimit?: number }
  ): Promise<string> => {
    const { retryLimit = 0 } = option || {}
    const id = uuidv4()
    const insertQuery = `
      INSERT INTO _jobs (id, name, data, state, retrycount)
      VALUES (?, ?, ?, 'created', ?)
    `
    await this._query(insertQuery, [id, job, JSON.stringify(data), retryLimit])
    return id
  }

  work = <D>(jobName: string, callback: (job: PgBoss.Job<D>) => Promise<void>): void => {
    const interval = setInterval(async () => {
      const selectQuery = `
        SELECT * FROM _jobs
        WHERE name = ? AND state IN ('created', 'retry')
        LIMIT 1
      `
      const {
        rows: [job],
      } = await this._query<SqliteBossJob>(selectQuery, [jobName])
      if (job) {
        try {
          const updateActiveQuery = `
            UPDATE _jobs
            SET state = 'active', retrycount = ?
            WHERE id = ?
          `
          await this._query(updateActiveQuery, [job.retrycount, job.id])
          const data = JSON.parse(job.data)
          await callback({ id: job.id, name: job.name, data })
          const updateCompletedQuery = `
            UPDATE _jobs
            SET state = 'completed', retrycount = 0
            WHERE id = ?
          `
          await this._query(updateCompletedQuery, [job.id])
        } catch (error) {
          if (job.retrycount > 0) {
            const updateRetryQuery = `
              UPDATE _jobs
              SET state = 'retry', retrycount = ?
              WHERE id = ?
            `
            await this._query(updateRetryQuery, [job.retrycount - 1, job.id])
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

  getJobById = async (id: string) => {
    const selectQuery = `
      SELECT * FROM _jobs
      WHERE id = ?
    `
    const {
      rows: [job],
    } = await this._query<SqliteBossJob>(selectQuery, [id])
    job.data = JSON.parse(job.data)
    return job
  }

  fetch = async (name: string) => {
    const selectQuery = `
      SELECT * FROM _jobs
      WHERE name = ? AND state IN ('created', 'retry')
      LIMIT 1
    `
    const {
      rows: [job],
    } = await this._query<SqliteBossJob>(selectQuery, [name])
    return job
  }
}
