import type { EngineError } from '@domain/entities/EngineError'

export interface IController<T> {
  createEntity(data: unknown): Promise<{ entity?: T; errors: EngineError[] }>
}
