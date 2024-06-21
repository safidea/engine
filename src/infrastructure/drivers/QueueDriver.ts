import type { Driver } from '@adapter/spi/QueueSpi'
import type { Params, WaitForParams } from '@domain/services/Queue'
import SQLite from 'better-sqlite3'
import PgBoss from 'pg-boss'
import { v4 as uuidv4 } from 'uuid'
import { EventEmitter } from 'events'
import type { JobDto } from '@adapter/spi/dtos/JobDto'
import { Kysely, SqliteDialect } from 'kysely'

export class QueueDriver implements Driver {
  private boss: PgBoss | SqliteBoss

  constructor(public params: Params) {
    const { type, url } = params.database.params
    if (type === 'sqlite') {
      this.boss = new SqliteBoss(url)
    } else if (type === 'postgres') {
      this.boss = new PgBoss(url)
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

interface SqliteBossTable {
  id: string
  name: string
  data: string
  state: JobDto['state']
  retrycount: number
}

interface SqliteBossSchema {
  _jobs: SqliteBossTable
}

class SqliteBoss {
  private db: Kysely<SqliteBossSchema>
  private intervalsQueues: Timer[] = []
  private emitter: EventEmitter

  constructor(url: string) {
    const dialect = new SqliteDialect({
      database: new SQLite(url),
    })
    this.db = new Kysely<SqliteBossSchema>({ dialect })
    this.emitter = new EventEmitter()
  }

  on = (event: 'error' | 'stopped', callback: (error: Error) => void) => {
    this.emitter.on(event, callback)
  }

  start = async (): Promise<void> => {
    await this.db.schema
      .createTable('_jobs')
      .ifNotExists()
      .addColumn('id', 'text', (col) => col.primaryKey())
      .addColumn('name', 'text')
      .addColumn('data', 'text')
      .addColumn('state', 'text')
      .addColumn('retrycount', 'integer')
      .execute()
  }

  stop = async (): Promise<void> => {
    this.intervalsQueues.forEach((interval) => clearInterval(interval))
    await this.db.destroy()
    setTimeout(() => this.emitter.emit('stopped'), 100)
  }

  send = async <D extends object>(
    job: string,
    data: D,
    option?: { retryLimit?: number }
  ): Promise<string> => {
    const { retryLimit = 0 } = option || {}
    const id = uuidv4()
    await this.db
      .insertInto('_jobs')
      .values({
        id,
        name: job,
        data: JSON.stringify(data),
        state: 'created',
        retrycount: retryLimit,
      })
      .execute()
    return id
  }

  work = <D>(jobName: string, callback: (job: PgBoss.Job<D>) => Promise<void>): void => {
    const interval = setInterval(async () => {
      const job = await this.db
        .selectFrom('_jobs')
        .selectAll()
        .where('name', '=', jobName)
        .where('state', 'in', ['created', 'retry'])
        .limit(1)
        .executeTakeFirst()
      if (job) {
        try {
          await this.db
            .updateTable('_jobs')
            .set({
              state: 'active',
              retrycount: job.retrycount,
            })
            .where('id', '=', job.id)
            .execute()
          const data = JSON.parse(job.data)
          await callback({ id: job.id, name: job.name, data })
          await this.db
            .updateTable('_jobs')
            .set({
              state: 'completed',
              retrycount: 0,
            })
            .where('id', '=', job.id)
            .execute()
        } catch (error) {
          if (job.retrycount > 0) {
            await this.db
              .updateTable('_jobs')
              .set({
                state: 'retry',
                retrycount: job.retrycount - 1,
              })
              .where('id', '=', job.id)
              .execute()
          } else {
            await this.db
              .updateTable('_jobs')
              .set({
                state: 'failed',
                retrycount: 0,
              })
              .where('id', '=', job.id)
              .execute()
          }
        }
      }
    }, 500)
    this.intervalsQueues.push(interval)
  }

  getJobById = async (id: string) => {
    const job = await this.db
      .selectFrom('_jobs')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
    return job
  }

  fetch = async (jobName: string) => {
    const job = await this.db
      .selectFrom('_jobs')
      .selectAll()
      .where('name', '=', jobName)
      .where('state', 'in', ['created', 'retry', 'active'])
      .executeTakeFirst()
    return job
  }
}
