import type { Logger } from './Logger'
import type { Job } from '../entities/Job'

export interface Config {
  type: 'sqlite' | 'postgres'
  query: <T>(text: string, values: (string | number)[]) => Promise<{ rows: T[]; rowCount: number }>
  exec: (query: string) => Promise<void>
}

export interface Services {
  logger: Logger
}

export type State =
  | 'retry'
  | 'created'
  | 'active'
  | 'completed'
  | 'expired'
  | 'cancelled'
  | 'failed'
  | 'archive'

export interface WaitForParams {
  id?: string
  name?: string
  state: State
  timeout?: number
}

export interface Spi {
  onError: (callback: (error: Error) => void) => void
  start: () => Promise<void>
  stop: (options: { graceful: boolean }) => Promise<void>
  add: (job: string, data: object, options?: { retry: number }) => Promise<string>
  job: (job: string, callback: (id: string, data: object) => Promise<void>) => void
  getById: (id: string) => Promise<Job | undefined>
  waitFor: (params: WaitForParams) => Promise<boolean>
}

export class Queue {
  private log: (message: string) => void
  private jobs: {
    name: string
    callback: (id: string, data: object) => Promise<void>
  }[] = []

  constructor(
    private spi: Spi,
    services: Services
  ) {
    this.log = services.logger.init('queue')
  }

  onError = () => {
    this.spi.onError((error: Error) => {
      this.log(`queue error: ${error.message}`)
    })
  }

  start = async () => {
    this.log('starting queue...')
    await this.spi.start()
    for (const { name, callback } of this.jobs) {
      this.spi.job(name, callback)
    }
    this.log('queue started')
  }

  stop = async (options: { graceful: boolean }) => {
    try {
      this.log('stopping queue...')
      await this.spi.stop(options)
    } catch (error) {
      if (error instanceof Error) this.log(`error stopping queue: ${error.message}`)
    }
  }

  add = async <D extends object>(
    job: string,
    data: D,
    options?: { retry: number }
  ): Promise<string> => {
    this.log(`add job "${job}" to queue`)
    return this.spi.add(job, data, options)
  }

  job = (name: string, initCallback: (data: object) => Promise<void>) => {
    this.jobs.push({
      name,
      callback: async (id: string, data: object) => {
        this.log(`job "${name}" with id ${id} started`)
        await initCallback(data)
        this.log(`job "${name}" with id ${id} finished`)
      },
    })
  }

  getById = async (id: string) => {
    return this.spi.getById(id)
  }

  waitFor = async (params: WaitForParams) => {
    this.log(`waiting for job "${params.id ?? params.name}"...`)
    return this.spi.waitFor(params)
  }
}
