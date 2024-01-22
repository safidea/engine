import type { EngineError } from './EngineError'

export interface IEntity {
  name: string
  validateConfig(): EngineError[]
}
