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
  constructor(private _driver: Driver) {}

  getById = async (id: string) => {
    const jboDto = await this._driver.getById(id)
    if (!jboDto) return undefined
    return JobMapper.toEntity(jboDto)
  }

  add = async <D extends object>(job: string, data: D, options?: { retry: number }) => {
    return this._driver.add(job, data, options)
  }

  start = async () => {
    return this._driver.start()
  }

  stop = async (options: { graceful: boolean }) => {
    return this._driver.stop(options)
  }

  onError = (callback: (error: Error) => void) => {
    return this._driver.onError(callback)
  }

  job = <D extends object>(job: string, callback: (id: string, data: D) => Promise<void>) => {
    return this._driver.job(job, callback)
  }

  waitFor = async (params: WaitForParams) => {
    return this._driver.waitFor(params)
  }
}
