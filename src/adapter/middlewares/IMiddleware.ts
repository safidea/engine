import type { EngineError } from '@domain/entities/EngineError'

export interface IMiddleware<T> {
  validateSchema(data: unknown): { json?: T; errors?: EngineError[] }
}
