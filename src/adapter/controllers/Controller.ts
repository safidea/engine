import { components, type Components } from '@domain/components'
import type { IMiddleware } from '../middlewares/IMiddleware'
import type { ILoggerLog } from '@domain/drivers/ILogger'
import type { IEntity } from '@domain/entities/IEntity'
import type { EngineError, EngineErrorCode } from '@domain/entities/EngineError'

export class Controller<T> {
  constructor(
    protected middleware: IMiddleware<T>,
    protected log: ILoggerLog
  ) {}

  protected getComponents(customComponents: Partial<Components> = {}): Components {
    return { ...components, ...customComponents }
  }

  protected getSchemaWithErrors(data: unknown, error: (message: EngineErrorCode) => EngineError) {
    const { json, errors } = this.middleware.validateSchema(data)
    if (errors.length > 0) {
      this.log(`schema errors: ${JSON.stringify(errors, null, 2)}`)
      return { errors }
    }
    if (!json) {
      this.log('UNKNOWN_SCHEMA_ERROR')
      return { errors: [error('UNKNOWN_SCHEMA_ERROR')] }
    }
    return { json }
  }

  protected getConfigErrors(entity: IEntity) {
    const errors = entity.validateConfig()
    if (errors.length > 0) {
      this.log(`config errors: ${JSON.stringify(errors, null, 2)}`)
      return errors
    }
  }
}
