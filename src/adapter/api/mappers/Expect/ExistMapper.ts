import {
  ExistExpect,
  type ExistExpectConfig,
  type ExistExpectServices,
} from '@domain/entities/Expect/Exist'

export class ExistExpectMapper {
  static toEntity = (config: ExistExpectConfig, services: ExistExpectServices): ExistExpect => {
    return new ExistExpect(config, services)
  }
}
