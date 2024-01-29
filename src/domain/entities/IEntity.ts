import type { EngineError } from './EngineError'

export interface IEntity {
  name: string
  path?: string
  validateConfig(): EngineError[]
}
