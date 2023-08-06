import { FetchState, Fetcher } from '@adapter/spi/fetcher/Fetcher'

export class FetcherConnection {
  constructor(private readonly fetcher: Fetcher) {}

  useFetch<T>(url: string): FetchState<T> {
    return this.fetcher.useFetch(url)
  }

  async fetch(url: string, options?: RequestInit): Promise<Response> {
    return this.fetcher.fetch(url, options)
  }
}
