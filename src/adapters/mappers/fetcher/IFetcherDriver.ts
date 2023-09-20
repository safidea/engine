export interface FetchState<T> {
  data: T | undefined
  error: string | undefined
  isLoading: boolean
}

export interface IFetcherDriver {
  domain: string
  name: string
  getFetch: () => (url: string, options?: RequestInit) => Promise<Response>
  getUseFetch: () => <T>(url: string, options?: RequestInit) => FetchState<T>
}
