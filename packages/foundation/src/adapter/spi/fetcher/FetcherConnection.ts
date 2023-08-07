import { FetchState, Fetcher } from '@adapter/spi/fetcher/Fetcher'

export class FetcherConnection {
  constructor(private readonly fetcher: Fetcher) {}

  getUseFetch(): <T>(url: string, options?: RequestInit) => FetchState<T> {
    return this.fetcher.getUseFetch()
  }

  getFetch(): (url: string, options?: RequestInit) => Promise<Response> {
    return this.fetcher.getFetch()
  }
}
