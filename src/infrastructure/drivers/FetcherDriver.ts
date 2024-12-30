import type { IFetcherDriver } from '@adapter/spi/drivers/FetcherSpi'

export class FetcherDriver implements IFetcherDriver {
  get = (url: string) => {
    return fetch(url)
  }
}
