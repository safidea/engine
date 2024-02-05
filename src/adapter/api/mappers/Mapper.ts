import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import type { EngineErrorCode } from '@domain/entities/EngineError'
import type { Services } from '@domain/services'

export interface Mapper<Dto, Error, Entity, Params> {
  toEntity: (dto: Dto, params: Params) => Entity
  toManyEntities: (dtos: Dto[], params: Params) => Entity[]
  toEntityFromServices: (dto: Dto, services: Services) => Entity
  toManyEntitiesFromServices: (dtos: Dto[], services: Services) => Entity[]
  toErrorEntity: (errorDto: SchemaValidatorErrorDto) => Error
  toManyErrorEntities: (errorDtos: SchemaValidatorErrorDto[]) => Error[]
  toErrorEntityFromCode: (code: EngineErrorCode) => Error
}
