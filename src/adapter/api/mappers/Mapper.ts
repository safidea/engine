import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import type { EngineErrorCode } from '@domain/entities/EngineError'
import type { Services } from '@domain/services'

export interface Mapper<Dto, Error, Entity> {
  toEntity: (config: Dto, services: Services, ...args: string[]) => Entity
  toErrorEntity: (errorDto: SchemaValidatorErrorDto) => Error
  toErrorEntities: (errorDtos: SchemaValidatorErrorDto[]) => Error[]
  toErrorEntityFromCode: (code: EngineErrorCode) => Error
}
