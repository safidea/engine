import type { Result as ResultConfig } from '@adapter/api/configs/spec/result'
import type { Result } from '@domain/engine/spec/result'
import { Title } from '@domain/engine/spec/result/Title'
import { Text } from '@domain/engine/spec/result/Text'
import { InputText } from '@domain/engine/spec/result/InputText'
import { Record } from '@domain/engine/spec/result/Record'
import type { BaseParams as ResultParams } from '@domain/engine/spec/result/base'
import { FilterMapper } from '@adapter/spi/mappers/FilterMapper'
import { Attribute } from '@domain/engine/spec/result/Attribute'
import { Email } from '@domain/engine/spec/result/Email'

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
    if ('attribute' in config) {
      return new Attribute({ ...config, ...params })
    }
    if ('table' in config) {
      const find = config.find.map((filter) => FilterMapper.toEntityFromConfig(filter))
      return new Record({ ...config, ...params, find })
    }
    if ('mailbox' in config) {
      const find = config.find.map((filter) => FilterMapper.toEntityFromConfig(filter))
      return new Email({ ...config, ...params, find })
    }
    throw new Error('Unknown result type')
  }

  static toManyEntities = (configs: ResultConfig[], params: ResultParams): Result[] => {
    return configs.map((config) => this.toEntity(config, params))
  }
}
