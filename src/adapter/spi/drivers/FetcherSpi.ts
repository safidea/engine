import type { IFetcherSpi } from '@domain/services/Fetcher'

export interface IFetcherDriver {
  get: (url: string) => Promise<Response>
}

export class FetcherSpi implements IFetcherSpi {
  constructor(private _driver: IFetcherDriver) {}

  get = (url: string) => {
    return this._driver.get(url)
  }
}
