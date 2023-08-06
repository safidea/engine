export interface FetchState<T> {
  data: T | undefined
  error: string | undefined
  isLoading: boolean
}

export interface Fetcher {
  fetch: (url: string, options?: RequestInit) => Promise<Response>
  useFetch: <T>(url: string) => FetchState<T>
}
