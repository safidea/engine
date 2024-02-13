import type { Params, Spi } from '@domain/services/Queue'
import type { JobDto } from './dtos/JobDto'
import { JobMapper } from './mappers/JobMapper'

export interface Driver {
  params: Params
  onError: (callback: (error: Error) => void) => void
  start: () => Promise<void>
  stop: () => Promise<void>
  add: <D extends object>(job: string, data: D, options?: { retry: number }) => Promise<string>
  job: <D extends object>(job: string, callback: (data: D) => Promise<void>) => void
  get: (id: string) => Promise<JobDto | undefined>
  wait: (id: string) => Promise<void>
  waitForAll: (job: string) => Promise<void>
}

export class QueueSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  get = async (id: string) => {
    const jboDto = await this.driver.get(id)
    if (!jboDto) return undefined
    return JobMapper.toEntity(jboDto)
  }

  add = async <D extends object>(job: string, data: D, options?: { retry: number }) => {
    return this.driver.add(job, data, options)
  }

  start = async () => {
    return this.driver.start()
  }

  stop = async () => {
    return this.driver.stop()
  }

  onError = (callback: (error: Error) => void) => {
    return this.driver.onError(callback)
  }

  job = <D extends object>(job: string, callback: (data: D) => Promise<void>) => {
    return this.driver.job(job, callback)
  }

  wait = async (id: string) => {
    return this.driver.wait(id)
  }

  waitForAll = async (job: string) => {
    return this.driver.waitForAll(job)
  }
}
