import type { EngineError } from './EngineError'

export interface IList<T> {
  length: number
  all: T[]
  validateConfig(): EngineError[]
  includes(name: string): boolean
  find(name: string): T | undefined
}
