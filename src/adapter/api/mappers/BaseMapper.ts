import type { Services } from '@domain/services'

export interface BaseMapper<Dto, Entity, Params> {
  toEntity: (dto: Dto, params: Params) => Entity
  toManyEntities: (dtos: Dto[], params: Params) => Entity[]
  toEntityFromServices: (dto: Dto, services: Services) => Entity
  toManyEntitiesFromServices: (dtos: Dto[], services: Services) => Entity[]
}
