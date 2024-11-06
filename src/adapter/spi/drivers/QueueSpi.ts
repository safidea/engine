import type { Spi } from '@domain/services/Queue'

export interface Driver {
  onError: (callback: (error: Error) => void) => void
  start: () => Promise<void>
  stop: (options: { graceful: boolean }) => Promise<void>
  add: <D extends object>(job: string, data: D, options?: { retry: number }) => Promise<void>
  job: <D extends object>(
    job: string,
    callback: (id: string, data: D) => Promise<void>
  ) => Promise<void>
  waitForEmpty: (name: string, timeout: number) => Promise<boolean>
}

export class QueueSpi implements Spi {
  constructor(private _driver: Driver) {}

  onError = (callback: (error: Error) => void) => {
    return this._driver.onError(callback)
  }

  start = async () => {
    return this._driver.start()
  }

  stop = async (options: { graceful: boolean }) => {
    return this._driver.stop(options)
  }

  add = async <D extends object>(job: string, data: D, options?: { retry: number }) => {
    await this._driver.add(job, data, options)
  }

  job = async <D extends object>(job: string, callback: (id: string, data: D) => Promise<void>) => {
    await this._driver.job(job, callback)
  }

  waitForEmpty = async (name: string, timeout: number) => {
    return this._driver.waitForEmpty(name, timeout)
  }
}
