export interface IList<T> {
  includes(name: string): boolean
  find(name: string): T | undefined
}
