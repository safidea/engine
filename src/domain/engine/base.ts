import type { ConfigError } from '@domain/entities/error/Config'

export interface Base {
  name: string
  init: () => Promise<void>
  validateConfig: () => Promise<ConfigError[]>
}
