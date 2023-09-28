import { FetcherDrivers } from '@entities/services/fetcher/FetcherDrivers'

export interface FetchState<T> {
  data: T | undefined
  error: string | undefined
  isLoading: boolean
}

export interface IFetcherDriver {
  domain: string
  name: FetcherDrivers
  getFetch: () => (url: string, options?: RequestInit) => Promise<Response>
  getUseFetch: () => <T>(url: string, options?: RequestInit) => FetchState<T>
}
