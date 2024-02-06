import { Feature } from '@domain/entities/feature/Feature'
import { FeatureError, type FeatureErrorCode } from '@domain/entities/feature/FeatureError'
import { Services } from '@domain/services'
import type { Feature as FeatureConfig } from '../configs/Feature'
import type { Mapper } from './Mapper'
import { SpecMapper } from './spec/SpecMapper'
import { PageMapper } from './page/PageMapper'
import { TableMapper } from './table/TableMapper'
import type { EngineError } from '@domain/entities/EngineError'
import type { Params as SpecParams } from './spec/SpecMapper'
import type { Logger } from '@domain/services/Logger'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'

export interface Params {
  newLogger: (location: string) => Logger
  spec: SpecParams
}

export const FeatureMapper: Mapper<FeatureConfig, EngineError, Feature, Params> =
  class FeatureMapper {
    static getPaths = (instancePath: string): string[] => {
      return instancePath.split('/').filter((item) => item !== '')
    }

    static getFirstPath = (instancePath: string): string => {
      return this.getPaths(instancePath)[0]
    }

    static toEntity = (config: FeatureConfig, params: Params) => {
      const { name, specs: specConfigs = [] } = config
      const { spec, newLogger } = params
      const specs = specConfigs.map((specConfig) =>
        SpecMapper.toEntity(specConfig, { ...spec, feature: name })
      )
      const logger = newLogger(`feature:${name}`)
      return new Feature({
        name,
        specs,
        logger,
      })
    }

    static toManyEntities = (configs: FeatureConfig[], params: Params) => {
      return configs.map((config) => this.toEntity(config, params))
    }

    static toEntityFromServices = (config: FeatureConfig, services: Services) => {
      const newLogger = (location: string) => services.logger(location)
      const newBrowser = () => services.browser()
      const spec = { feature: 'current', newLogger, newBrowser }
      return this.toEntity(config, { spec, newLogger })
    }

    static toManyEntitiesFromServices = (configs: FeatureConfig[], services: Services) => {
      return configs.map((config) => this.toEntityFromServices(config, services))
    }

    static toErrorEntity = (errorDto: SchemaValidatorErrorDto) => {
      const { instancePath, keyword, params } = errorDto
      const firstPath = this.getFirstPath(instancePath)
      if (firstPath === 'specs') {
        return SpecMapper.toErrorEntity(errorDto)
      } else if (firstPath === 'pages') {
        return PageMapper.toErrorEntity(errorDto)
      } else if (firstPath === 'tables') {
        return TableMapper.toErrorEntity(errorDto)
      } else {
        if (keyword === 'required') {
          if (params.missingProperty === 'name') return new FeatureError('NAME_REQUIRED')
        } else if (keyword === 'additionalProperties') {
          return new FeatureError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
        } else if (keyword === 'type') {
          if (instancePath === '/name') return new FeatureError('NAME_STRING_TYPE_REQUIRED')
        }
      }
      return new FeatureError('UNKNOWN_SCHEMA_ERROR')
    }

    static toManyErrorEntities = (errorDtos: SchemaValidatorErrorDto[]) => {
      return errorDtos.map(this.toErrorEntity)
    }

    static toErrorEntityFromCode = (code: FeatureErrorCode) => {
      return new FeatureError(code)
    }
  }
