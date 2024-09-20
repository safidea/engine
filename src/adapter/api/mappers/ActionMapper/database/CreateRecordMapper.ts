import type { CreateRecord as CreateRecordConfig } from '@adapter/api/configs/Action/database/CreateRecord'
import {
  CreateRecord,
  type Services,
  type Entities,
} from '@domain/entities/Action/database/CreateRecord'

export type CreateRecordServices = Services

export type CreateRecordEntities = Entities

export class CreateRecordMapper {
  static toEntity = (
    config: CreateRecordConfig,
    services: Services,
    entities: Entities
  ): CreateRecord => {
    return new CreateRecord(config, services, entities)
  }
}
