import type { ConfigError } from './ConfigError'

export interface IEntity {
  validateConfig(): ConfigError[]
}
