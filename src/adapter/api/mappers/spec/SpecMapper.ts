import { Spec } from '@domain/engine/spec/Spec'
import { Services } from '@domain/services'
import type { Spec as SpecConfig } from '../../configs/spec/Spec'
import type { Mapper } from '../Mapper'
import { ActionMapper } from './ActionMapper'
import { ResultMapper } from './ResultMapper'
import type { Logger } from '@domain/services/Logger'
import type { Browser } from '@domain/services/Browser'

export interface Params {
  feature: string
  newLogger: (location: string) => Logger
  newBrowser: () => Browser
}

export const SpecMapper: Mapper<SpecConfig, Spec, Params> = class SpecMapper {
  static toEntity = (config: SpecConfig, params: Params) => {
    const { feature, newLogger, newBrowser } = params
    const logger = newLogger(`spec:${config.name}`)
    const when = ActionMapper.toManyEntities(config.when, { logger, feature, spec: config.name })
    const then = ResultMapper.toManyEntities(config.then, { logger, feature, spec: config.name })
    return new Spec({
      name: config.name,
      when,
      then,
      newBrowser,
      logger,
      feature,
    })
  }

  static toManyEntities = (configs: SpecConfig[], params: Params) => {
    return configs.map((config) => this.toEntity(config, params))
  }

  static toEntityFromServices = (config: SpecConfig, services: Services) => {
    const newBrowser = () => services.browser()
    const newLogger = (location: string) => services.logger({ location })
    const feature = 'current'
    return this.toEntity(config, { feature, newLogger, newBrowser })
  }

  static toManyEntitiesFromServices = (configs: SpecConfig[], services: Services) => {
    return configs.map((config) => this.toEntityFromServices(config, services))
  }
}
