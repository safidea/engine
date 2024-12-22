import {
  EqualExpect,
  type EqualExpectConfig,
  type EqualExpectServices,
} from '@domain/entities/Expect/Equal'

export class EqualExpectMapper {
  static toEntity = (config: EqualExpectConfig, services: EqualExpectServices): EqualExpect => {
    return new EqualExpect(config, services)
  }
}
