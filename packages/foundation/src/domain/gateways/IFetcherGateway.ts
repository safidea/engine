export interface FetchState<T> {
  data: T | undefined
  error: Error | undefined
  isLoading: boolean
}
export type IFetcherGateway = <T>(url: string) => FetchState<T>
