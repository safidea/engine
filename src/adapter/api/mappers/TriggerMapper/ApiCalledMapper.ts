import { ApiCalled, type Config, type Services } from '@domain/entities/Trigger/ApiCalled'

export class ApiCalledMapper {
  static toEntity = (config: Config, services: Services): ApiCalled => {
    return new ApiCalled(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): ApiCalled[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
