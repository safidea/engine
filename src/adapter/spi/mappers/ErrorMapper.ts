import { SchemaError } from '@domain/entities/error/Schema'
import type { SchemaErrorDto } from '../dtos/ErrorDto'

export class ErrorMapper {
  static toSchemaEntity = (error: SchemaErrorDto) => {
    return new SchemaError(error)
  }

  static toManySchemaEntities = (errors: SchemaErrorDto[]) => {
    return errors.map(ErrorMapper.toSchemaEntity)
  }
}
