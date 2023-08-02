export interface FetchState<T> {
  data: T | undefined
  error: Error | undefined
  isLoading: boolean
}
export type IFetcherGateway = {
  fetch: (url: string, options?: RequestInit) => Promise<Response>
  useFetch: <T>(url: string) => FetchState<T>
}
