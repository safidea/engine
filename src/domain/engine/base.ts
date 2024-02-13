import type { ConfigError } from '@domain/entities/error/Config'

export interface Base {
  name: string
  validateConfig(): ConfigError[]
}
