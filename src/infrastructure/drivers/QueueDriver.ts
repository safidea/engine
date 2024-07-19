import type { Driver } from '@adapter/spi/QueueSpi'
import type { Config, WaitForParams } from '@domain/services/Queue'
import PgBoss from 'pg-boss'
import { v4 as uuidv4 } from 'uuid'
import { EventEmitter } from 'events'
import type { JobDto } from '@adapter/spi/dtos/JobDto'

export class QueueDriver implements Driver {
  private boss: PgBoss | SqliteBoss

  constructor({ type, query, exec }: Config) {
    if (type === 'sqlite') {
      this.boss = new SqliteBoss(query, exec)
    } else if (type === 'postgres') {
      this.boss = new PgBoss({
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
    this.boss.on('error', callback)
  }

  start = async () => {
    await this.boss.start()
  }

  stop = async () => {
    await this.boss.stop({ graceful: true, destroy: true })
    await new Promise((resolve) => {
      this.boss.on('stopped', () => resolve(true))
    })
  }

  add = async <D extends object>(job: string, data: D, options?: { retry: number }) => {
    const { retry = 0 } = options || {}
    const id = await this.boss.send(job, data, {
      retryLimit: retry,
    })
    if (!id) {
      throw new Error('Failed to send job')
    }
    return id
  }

  job = <D extends object>(job: string, callback: (data: D) => Promise<void>) => {
    this.boss.work(job, async (job: PgBoss.Job<D>) => {
      await callback(job.data)
    })
  }

  getById = async (id: string): Promise<JobDto | undefined> => {
    const job = await this.boss.getJobById(id)
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
          const runningJob = await this.boss.fetch(name)
          if (!runningJob) {
            clearInterval(interval)
            resolve(true)
          }
        }
      }, 500)
    })
    return Promise.race([waiterPromise, timeoutPromise])
  }

  waitForAllCompleted = async (name: string) => {
    let isCompleted = false
    while (!isCompleted) {
      const job = await this.boss.fetch(name)
      if (!job) {
        isCompleted = true
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
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
  private intervalsQueues: Timer[] = []
  private emitter: EventEmitter

  constructor(
    private query: Config['query'],
    private exec: Config['exec']
  ) {
    this.emitter = new EventEmitter()
  }

  on = (event: 'error' | 'stopped', callback: (error: Error) => void) => {
    this.emitter.on(event, callback)
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
    await this.exec(createTableQuery)
  }

  stop = async (): Promise<void> => {
    this.intervalsQueues.forEach((interval) => clearInterval(interval))
    setTimeout(() => this.emitter.emit('stopped'), 100)
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
    await this.query(insertQuery, [id, job, JSON.stringify(data), retryLimit])
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
      } = await this.query<SqliteBossJob>(selectQuery, [jobName])
      if (job) {
        try {
          const updateActiveQuery = `
            UPDATE _jobs
            SET state = 'active', retrycount = ?
            WHERE id = ?
          `
          await this.query(updateActiveQuery, [job.retrycount, job.id])
          const data = JSON.parse(job.data)
          await callback({ id: job.id, name: job.name, data })
          const updateCompletedQuery = `
            UPDATE _jobs
            SET state = 'completed', retrycount = 0
            WHERE id = ?
          `
          await this.query(updateCompletedQuery, [job.id])
        } catch (error) {
          if (job.retrycount > 0) {
            const updateRetryQuery = `
              UPDATE _jobs
              SET state = 'retry', retrycount = ?
              WHERE id = ?
            `
            await this.query(updateRetryQuery, [job.retrycount - 1, job.id])
          } else {
            const updateFailedQuery = `
              UPDATE _jobs
              SET state = 'failed', retrycount = 0
              WHERE id = ?
            `
            await this.query(updateFailedQuery, [job.id])
          }
        }
      }
    }, 500)
    this.intervalsQueues.push(interval)
  }

  getJobById = async (id: string) => {
    const selectQuery = `
      SELECT * FROM _jobs
      WHERE id = ?
    `
    const {
      rows: [job],
    } = await this.query<SqliteBossJob>(selectQuery, [id])
    return job
  }

  fetch = async (jobName: string) => {
    const selectQuery = `
      SELECT * FROM _jobs
      WHERE name = ? AND state IN ('created', 'retry', 'active')
    `
    const {
      rows: [job],
    } = await this.query<SqliteBossJob>(selectQuery, [jobName])
    return job
  }
}
