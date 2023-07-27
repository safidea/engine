export interface FetchState<T> {
  data: T | undefined
  error: Error | undefined
  isLoading: boolean
}
export type IFetcherRepository = <T>(url: string) => FetchState<T>
