import { Spec } from '@domain/entities/spec/Spec'
import { SpecError, type SpecErrorCode } from '@domain/entities/spec/SpecError'
import { Services } from '@domain/services'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import type { Spec as SpecConfig } from '../../configs/spec/Spec'
import type { Mapper } from '../Mapper'
import { ActionMapper } from './ActionMapper'
import { ResultMapper } from './ResultMapper'

export const SpecMapper: Mapper<SpecConfig, SpecError, Spec> = class SpecMapper {
  static toEntity = (config: SpecConfig, services: Services, feature: string) => {
    const newServer = () => services.server()
    const newDatabase = () => services.database()
    const newBrowser = () => services.browser()
    const logger = services.logger(`feature:${feature}:spec:${config.name}`)
    const params = { logger, feature, spec: config.name }
    const when = ActionMapper.toManyEntities(config.when, params)
    const then = ResultMapper.toManyEntities(config.then, params)
    return new Spec({
      name: config.name,
      when,
      then,
      newServer,
      newDatabase,
      newBrowser,
      logger,
      feature,
    })
  }

  static toManyEntities = (configs: SpecConfig[], services: Services, feature: string) => {
    return configs.map((config) => this.toEntity(config, services, feature))
  }

  static toErrorEntity = (errorDto: SchemaValidatorErrorDto) => {
    const { instancePath, keyword, params } = errorDto
    if (keyword === 'required') {
      if (params.missingProperty === 'name') return new SpecError('NAME_REQUIRED')
      if (params.missingProperty === 'when') return new SpecError('WHEN_REQUIRED')
      if (params.missingProperty === 'then') return new SpecError('THEN_REQUIRED')
    } else if (keyword === 'additionalProperties') {
      return new SpecError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
    } else if (keyword === 'type') {
      if (instancePath === '/name') return new SpecError('NAME_STRING_TYPE_REQUIRED')
    }
    return new SpecError('UNKNOWN_SCHEMA_ERROR')
  }

  static toManyErrorEntities = (errorDtos: SchemaValidatorErrorDto[]) => {
    return errorDtos.map(this.toErrorEntity)
  }

  static toErrorEntityFromCode = (code: SpecErrorCode) => {
    return new SpecError(code)
  }
}
