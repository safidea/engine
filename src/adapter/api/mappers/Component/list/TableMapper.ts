import {
  Table,
  type Config,
  type Services,
  type Entities,
} from '@domain/entities/Component/list/Table'

export type TableServices = Services

export type TableEntities = Entities

export class TableMapper {
  static toEntity = (config: Config, services: Services, entities: Entities): Table => {
    return new Table(config, services, entities)
  }
}
