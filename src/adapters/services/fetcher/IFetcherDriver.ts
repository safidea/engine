export interface FetchState<T> {
  data: T | undefined
  error: string | undefined
  isLoading: boolean
}

export interface IFetcherDriver {
  url: string
  name: string
  setUrl: (url: string) => void
  getFetch: () => (url: string, options?: RequestInit) => Promise<Response>
  getUseFetch: () => <T>(url: string, options?: RequestInit) => FetchState<T>
}
