import type { Spi, WaitForParams } from '@domain/services/Queue'
import type { JobDto } from './dtos/JobDto'
import { JobMapper } from './mappers/JobMapper'

export interface Driver {
  onError: (callback: (error: Error) => void) => void
  start: () => Promise<void>
  stop: (options: { graceful: boolean }) => Promise<void>
  add: <D extends object>(job: string, data: D, options?: { retry: number }) => Promise<string>
  job: <D extends object>(job: string, callback: (id: string, data: D) => Promise<void>) => void
  getById: (id: string) => Promise<JobDto | undefined>
  waitFor: (params: WaitForParams) => Promise<boolean>
}

export class QueueSpi implements Spi {
  constructor(private driver: Driver) {}

  getById = async (id: string) => {
    const jboDto = await this.driver.getById(id)
    if (!jboDto) return undefined
    return JobMapper.toEntity(jboDto)
  }

  add = async <D extends object>(job: string, data: D, options?: { retry: number }) => {
    return this.driver.add(job, data, options)
  }

  start = async () => {
    return this.driver.start()
  }

  stop = async (options: { graceful: boolean }) => {
    return this.driver.stop(options)
  }

  onError = (callback: (error: Error) => void) => {
    return this.driver.onError(callback)
  }

  job = <D extends object>(job: string, callback: (id: string, data: D) => Promise<void>) => {
    return this.driver.job(job, callback)
  }

  waitFor = async (params: WaitForParams) => {
    return this.driver.waitFor(params)
  }
}
