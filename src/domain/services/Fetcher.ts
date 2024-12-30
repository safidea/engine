export interface IFetcherSpi {
  get: (path: string) => Promise<Response>
}

export class Fetcher {
  constructor(private _spi: IFetcherSpi) {}

  get = (url: string): Promise<Response> => {
    return this._spi.get(url)
  }
}
