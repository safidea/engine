import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'
import type { EngineError } from '@domain/entities/EngineError'

export interface IMapper {
  schemaValidatorToEngineError(schemaValidatorError: ISchemaValidatorError): EngineError | undefined
  schemaValidatorToEngineErrors(schemaValidatorErrors: ISchemaValidatorError[]): EngineError[]
}
