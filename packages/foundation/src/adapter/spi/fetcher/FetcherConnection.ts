import { FetchState, Fetcher } from '@adapter/spi/fetcher/Fetcher'

export class FetcherConnection {
  constructor(private readonly fetcher: Fetcher) {}

  getUseFetch(): <T>(url: string) => FetchState<T> {
    const { useFetch } = this.fetcher
    return <T>(url: string) => useFetch<T>(url)
  }

  getFetch(): (url: string, options?: RequestInit) => Promise<Response> {
    const { fetch } = this.fetcher
    return (url: string, options?: RequestInit) => fetch(url, options)
  }
}
