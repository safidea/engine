import { App } from '@domain/entities/app/App'
import { AppError, type AppErrorCode } from '@domain/entities/app/AppError'
import { Services } from '@domain/services'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import type { App as AppConfig } from '../configs/App'
import type { Feature as FeatureConfig } from '../configs/Feature'
import type { Mapper } from './Mapper'
import { SpecMapper } from './spec/SpecMapper'
import { PageMapper, type Params as PageParams } from './page/PageMapper'
import { TableMapper, type Params as TableParams } from './table/TableMapper'
import type { EngineError } from '@domain/entities/EngineError'
import type { Database } from '@domain/services/Database'
import type { Table } from '@domain/entities/table/Table'
import type { Page } from '@domain/entities/page/Page'
import type { Server } from '@domain/services/Server'
import type { Logger } from '@domain/services/Logger'

export interface Params {
  table: TableParams
  page: PageParams
  newLogger: (location: string) => Logger
  server: Server
  database?: Database
}

interface Private {
  featureToEntityFromServices: (featureConfig: FeatureConfig, services: Services) => App
}

export const AppMapper: Mapper<AppConfig, EngineError, App, Params> & Private = class AppMapper {
  static getPaths = (instancePath: string): string[] => {
    return instancePath.split('/').filter((item) => item !== '')
  }

  static getFirstPath = (instancePath: string): string => {
    return this.getPaths(instancePath)[0]
  }

  static toEntity = (config: AppConfig, params: Params) => {
    const { name, features } = config
    const { server, newLogger, database } = params
    const tables: Table[] = []
    const pages: Page[] = []
    for (const feature of features) {
      if (feature.tables) tables.push(...TableMapper.toManyEntities(feature.tables, params.table))
      if (feature.pages) pages.push(...PageMapper.toManyEntities(feature.pages, params.page))
    }
    const logger = newLogger(`app:${name}`)
    return new App({
      name,
      tables,
      pages,
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
    const table = { newLogger, server, database, record }
    const page = { server, newLogger, ui, components }
    return this.toEntity(config, { table, page, newLogger, server, database })
  }

  static featureToEntityFromServices = (featureConfig: FeatureConfig, services: Services) => {
    const appConfig: AppConfig = {
      name: 'feature: ' + featureConfig.name,
      features: [featureConfig],
    }
    return this.toEntityFromServices(appConfig, services)
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
