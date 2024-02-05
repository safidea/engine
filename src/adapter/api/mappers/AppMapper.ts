import { App } from '@domain/entities/app/App'
import { AppError, type AppErrorCode } from '@domain/entities/app/AppError'
import { Services } from '@domain/services'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import type { App as AppConfig } from '../configs/App'
import type { Mapper } from './Mapper'
import { SpecMapper } from './spec/SpecMapper'
import { PageMapper } from './page/PageMapper'
import { TableMapper } from './table/TableMapper'
import type { EngineError } from '@domain/entities/EngineError'
import { FeatureMapper, type Params as FeatureParams } from './FeatureMapper'
import { RoleMapper } from './RoleMapper'
import type { Database } from '@domain/services/Database'

export interface Params extends FeatureParams {
  database: Database
}

export const AppMapper: Mapper<AppConfig, EngineError, App, Params> = class AppMapper {
  static getPaths = (instancePath: string): string[] => {
    return instancePath.split('/').filter((item) => item !== '')
  }

  static getFirstPath = (instancePath: string): string => {
    return this.getPaths(instancePath)[0]
  }

  static toEntity = (config: AppConfig, params: Params) => {
    const { name, features: featuresConfigs, roles: rolesConfigs = [] } = config
    const { server, newLogger, database } = params
    const features = FeatureMapper.toManyEntities(featuresConfigs, params)
    const roles = RoleMapper.toManyEntities(rolesConfigs, undefined)
    const logger = newLogger(`app:${name}`)
    return new App({
      name,
      features,
      roles,
      server,
      logger,
      database,
    })
  }

  static toManyEntities = (configs: AppConfig[], params: Params) => {
    return configs.map((config) => this.toEntity(config, params))
  }

  static toEntityFromServices = (config: AppConfig, services: Services) => {
    const server = services.server()
    const ui = services.ui()
    const components = services.components
    const database = services.database()
    const record = services.record()
    const newLogger = (location: string) => services.logger(location)
    const newServer = () => services.server()
    const newDatabase = () => services.database()
    const newBrowser = () => services.browser()
    const table = { newLogger, server, database, record }
    const page = { server, newLogger, ui, components }
    const spec = { feature: 'current', newLogger, newServer, newDatabase, newBrowser }
    return this.toEntity(config, { table, page, spec, newLogger, server, database })
  }

  static toManyEntitiesFromServices = (configs: AppConfig[], services: Services) => {
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
        if (params.missingProperty === 'name') return new AppError('NAME_REQUIRED')
        if (params.missingProperty === 'features') return new AppError('FEATURES_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new AppError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new AppError('NAME_STRING_TYPE_REQUIRED')
        if (instancePath === '/roles') return new AppError('ROLES_ARRAY_TYPE_REQUIRED')
        if (instancePath === '/features') return new AppError('FEATURES_ARRAY_TYPE_REQUIRED')
      }
    }
    return new AppError('UNKNOWN_SCHEMA_ERROR')
  }

  static toManyErrorEntities = (errorDtos: SchemaValidatorErrorDto[]) => {
    return errorDtos.map(this.toErrorEntity)
  }

  static toErrorEntityFromCode = (code: AppErrorCode) => {
    return new AppError(code)
  }
}
