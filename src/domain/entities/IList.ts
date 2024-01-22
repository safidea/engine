import type { ConfigError } from './ConfigError'

export interface IList<T> {
  validateConfig(): ConfigError[]
  includes(name: string): boolean
  find(name: string): T | undefined
}
