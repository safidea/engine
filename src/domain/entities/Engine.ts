import type { EngineError } from './EngineError'
import { Services } from '@domain/services'

export interface EngineParams {
  services: Services
}

export interface Engine {
  name: string
  path?: string
  validateConfig(): EngineError[]
}
