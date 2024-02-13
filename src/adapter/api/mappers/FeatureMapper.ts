import { Feature } from '@domain/engine/Feature'
import { Services } from '@domain/services'
import type { Feature as FeatureConfig } from '../configs/Feature'
import type { Mapper } from './Mapper'
import { SpecMapper } from './spec/SpecMapper'
import type { Params as SpecParams } from './spec/SpecMapper'
import type { Logger } from '@domain/services/Logger'

export interface Params {
  newLogger: (location: string) => Logger
  spec: SpecParams
}

export const FeatureMapper: Mapper<FeatureConfig, Feature, Params> =
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
      const newLogger = (location: string) => services.logger({ location })
      const newBrowser = () => services.browser()
      const spec = { feature: 'current', newLogger, newBrowser }
      return this.toEntity(config, { spec, newLogger })
    }

    static toManyEntitiesFromServices = (configs: FeatureConfig[], services: Services) => {
      return configs.map((config) => this.toEntityFromServices(config, services))
    }
  }
