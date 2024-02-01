import type { EngineError } from './EngineError'

export interface Engine {
  name: string
  path?: string
  validateConfig(): EngineError[]
}
