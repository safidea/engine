import type { ConfigError } from './ConfigError'

export interface IEntity {
  name: string
  validateConfig(): ConfigError[]
}
