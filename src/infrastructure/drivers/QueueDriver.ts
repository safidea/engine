import type { Driver } from '@adapter/spi/QueueSpi'
import type { Params } from '@domain/services/Queue'
import SQLite from 'better-sqlite3'
import PgBoss from 'pg-boss'
import { v4 as uuidv4 } from 'uuid'
import { EventEmitter } from 'events'
import type { JobDto } from '@adapter/spi/dtos/JobDto'

export class QueueDriver implements Driver {
  private boss: PgBoss | SqliteBoss

  constructor(public params: Params) {
    const { database, url } = params
    if (database === 'sqlite') {
      this.boss = new SqliteBoss(url)
    } else if (database === 'postgres') {
      this.boss = new PgBoss(url)
    } else {
      throw new Error(`Database ${database} not supported`)
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

  get = async (id: string) => {
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

  wait = async (id: string) => {
    await new Promise((resolve) => {
      const interval = setInterval(async () => {
        const job = await this.boss.getJobById(id)
        if (!job) throw new Error('Job not found')
        if (job.state !== 'pending') {
          clearInterval(interval)
          resolve(true)
        }
      }, 500)
    })
  }
}

class SqliteBoss {
  private db: SQLite.Database
  private intervalsQueues: Timer[] = []
  private emitter: EventEmitter

  constructor(url: string) {
    this.db = new SQLite(url, { fileMustExist: true })
    this.emitter = new EventEmitter()
  }

  on = (event: 'error' | 'stopped', callback: (error: Error) => void) => {
    this.emitter.on(event, callback)
  }

  start = async (): Promise<void> => {
    this.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS _jobs (
            id TEXT PRIMARY KEY,
            name TEXT,
            data TEXT,
            state TEXT,
            retrycount INTEGER
        )`
      )
      .run()
  }

  stop = async (): Promise<void> => {
    this.intervalsQueues.forEach((interval) => clearInterval(interval))
    this.db.close()
    setTimeout(() => {
      this.emitter.emit('stopped')
    }, 100)
  }

  send = async <D extends object>(
    job: string,
    data: D,
    option?: { retryLimit?: number }
  ): Promise<string> => {
    const { retryLimit = 0 } = option || {}
    const id = uuidv4()
    this.db
      .prepare(`INSERT INTO _jobs (id, name, data, state, retrycount) VALUES (?, ?, ?, ?, ?)`)
      .run(id, job, JSON.stringify(data), 'pending', retryLimit)
    return id
  }

  work = <D>(jobName: string, callback: (job: PgBoss.Job<D>) => Promise<void>): void => {
    const getJob = this.db.prepare('SELECT * FROM _jobs WHERE name = ? AND state = ? LIMIT 1')
    const updateJobStatus = this.db.prepare(
      'UPDATE _jobs SET state = ?, retrycount = ? WHERE id = ?'
    )
    const interval = setInterval(async () => {
      const job = getJob.get(jobName, 'pending') as JobDto & { retrycount: number; data: string }
      if (job) {
        try {
          updateJobStatus.run('running', job.retrycount, job.id)
          const data = JSON.parse(job.data)
          await callback(data)
          updateJobStatus.run('completed', 0, job.id)
        } catch (error) {
          if (job.retrycount > 0) {
            updateJobStatus.run('pending', job.retrycount - 1, job.id)
          } else {
            updateJobStatus.run('failed', 0, job.id)
          }
        }
      }
    }, 500)
    this.intervalsQueues.push(interval)
  }

  getJobById = async (id: string) => {
    const job = await this.db.prepare('SELECT * FROM _jobs WHERE id = ?').get(id)
    return job as JobDto & { retrycount: number }
  }
}
