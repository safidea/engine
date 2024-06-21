import type { Params, Spi, WaitForParams } from '@domain/services/Queue'
import type { JobDto } from './dtos/JobDto'
import { JobMapper } from './mappers/JobMapper'

export interface Driver {
  params: Params
  onError: (callback: (error: Error) => void) => void
  start: () => Promise<void>
  stop: () => Promise<void>
  add: <D extends object>(job: string, data: D, options?: { retry: number }) => Promise<string>
  job: <D extends object>(job: string, callback: (data: D) => Promise<void>) => void
  getById: (id: string) => Promise<JobDto | undefined>
  waitFor: (params: WaitForParams) => Promise<boolean>
  waitForAllCompleted: (name: string) => Promise<void>
}

export class QueueSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

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

  stop = async () => {
    return this.driver.stop()
  }

  onError = (callback: (error: Error) => void) => {
    return this.driver.onError(callback)
  }

  job = <D extends object>(job: string, callback: (data: D) => Promise<void>) => {
    return this.driver.job(job, callback)
  }

  waitFor = async (params: WaitForParams) => {
    return this.driver.waitFor(params)
  }

  waitForAllCompleted = async (job: string) => {
    return this.driver.waitForAllCompleted(job)
  }
}
