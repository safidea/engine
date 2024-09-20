import {
  CreatePdfFromXlsx,
  type Config,
  type Entities,
  type Services,
} from '@domain/entities/Action/spreadsheet/CreatePdfFromXlsx'

export type CreatePdfFromXlsxServices = Services

export class CreatePdfFromXlsxMapper {
  static toEntity = (config: Config, services: Services, entities: Entities): CreatePdfFromXlsx => {
    return new CreatePdfFromXlsx(config, services, entities)
  }
}
