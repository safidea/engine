import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'
import type { EngineError } from '@domain/entities/EngineError'

export interface IMapper {
  schemaValidatorToEngineErrors(schemaValidatorErrors: ISchemaValidatorError[]): EngineError[]
}
