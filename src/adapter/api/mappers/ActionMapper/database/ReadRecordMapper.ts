import {
  ReadRecord,
  type Config,
  type Entities,
  type Services,
} from '@domain/entities/Action/database/ReadRecord'

export class ReadRecordMapper {
  static toEntity = (config: Config, services: Services, entities: Entities): ReadRecord => {
    return new ReadRecord(config, services, entities)
  }
}
