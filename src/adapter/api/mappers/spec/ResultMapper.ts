import type { Result as ResultConfig } from '@adapter/api/configs/spec/result'
import type { Result } from '@domain/entities/spec/result'
import { Title } from '@domain/entities/spec/result/Title'
import { Text } from '@domain/entities/spec/result/Text'
import { InputText } from '@domain/entities/spec/result/InputText'
import { Record } from '@domain/entities/spec/result/Record'
import type { BaseParams as ResultParams } from '@domain/entities/spec/result/base'
import { DatabaseFilterMapper } from '@adapter/spi/mappers/DatabaseFilterMapper'
import { Attribute } from '@domain/entities/spec/result/Attribute'

export class ResultMapper {
  static toEntity = (config: ResultConfig, params: ResultParams): Result => {
    if ('title' in config) {
      return new Title({ ...config, ...params })
    }
    if ('text' in config) {
      return new Text({ ...config, ...params })
    }
    if ('input' in config) {
      return new InputText({ ...config, ...params })
    }
    if ('table' in config) {
      const find = config.findOne.map((filter) => DatabaseFilterMapper.toEntityFromConfig(filter))
      return new Record({ ...config, ...params, find })
    }
    if ('attribute' in config) {
      return new Attribute({ ...config, ...params })
    }
    throw new Error('Unknown result type')
  }

  static toManyEntities = (configs: ResultConfig[], params: ResultParams): Result[] => {
    return configs.map((config) => this.toEntity(config, params))
  }
}
