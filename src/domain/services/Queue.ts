import type { Logger } from './Logger'
import type { Job } from '../entities/job'

export interface Params {
  url: string
  db: 'sqlite' | 'postgres'
  logger: Logger
}

export interface Spi {
  params: Params
  onError: (callback: (error: Error) => void) => void
  start: () => Promise<void>
  stop: () => Promise<void>
  add: <D extends object>(job: string, data: D, options?: { retry: number }) => Promise<string>
  job: <D extends object>(job: string, callback: (data: D) => Promise<void>) => void
  get: (id: string) => Promise<Job | undefined>
  wait: (id: string) => Promise<void>
  waitForAll: (job: string) => Promise<void>
}

export class Queue {
  private jobs: {
    job: string
    callback: <D extends object>(data: D) => Promise<void>
  }[] = []

  constructor(private spi: Spi) {}

  onError = () => {
    const { logger } = this.spi.params
    return this.spi.onError((error: Error) => {
      logger.log(`queue error: ${error.message}`)
    })
  }

  start = async () => {
    const { logger } = this.spi.params
    logger.log('starting queue...')
    await this.spi.start()
    for (const { job, callback } of this.jobs) {
      this.spi.job(job, callback)
    }
    logger.log('queue started')
  }

  stop = async () => {
    const { logger } = this.spi.params
    logger.log('stopping queue...')
    await this.spi.stop()
  }

  add = async <D extends object>(
    job: string,
    data: D,
    options?: { retry: number }
  ): Promise<string> => {
    const { logger } = this.spi.params
    logger.log(`add job "${job}" to queue`)
    return this.spi.add(job, data, options)
  }

  job = (job: string, callback: <D extends object>(data: D) => Promise<void>) => {
    const { logger } = this.spi.params
    this.jobs.push({
      job,
      callback: async (data) => {
        logger.log(`job "${job}" started`)
        await callback(data)
        logger.log(`job "${job}" finished`)
      },
    })
  }

  get = async (id: string) => {
    return this.spi.get(id)
  }

  wait = async (id: string) => {
    const { logger } = this.spi.params
    logger.log(`waiting for job "${id}"...`)
    return this.spi.wait(id)
  }

  waitForAll = async (job: string) => {
    const { logger } = this.spi.params
    logger.log(`waiting for all jobs "${job}"...`)
    return this.spi.waitForAll(job)
  }
}
