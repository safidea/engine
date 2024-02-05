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
import type { Params as SpecParams } from './spec/SpecMapper'
import type { Params as PageParams } from './page/PageMapper'
import type { Params as TableParams } from './table/TableMapper'
import type { Logger } from '@domain/services/Logger'
import type { Server } from '@domain/services/Server'
import { RoleMapper } from './RoleMapper'

export interface Params {
  newLogger: (location: string) => Logger
  server: Server
  table: TableParams
  page: PageParams
  spec: SpecParams
}

export const AppMapper: Mapper<AppConfig, EngineError, App, Params> = class AppMapper {
  static getPaths = (instancePath: string): string[] => {
    return instancePath.split('/').filter((item) => item !== '')
  }

  static getFirstPath = (instancePath: string): string => {
    return this.getPaths(instancePath)[0]
  }

  static toEntity = (config: AppConfig, params: Params) => {
    const { name, features, roles: rolesConfigs } = config
    const { server, table, page, spec, newLogger } = params
    const specsConfigs = []
    const pagesConfigs = []
    const tablesConfigs = []
    for (const feature of features) {
      specsConfigs.push(...(feature.specs ?? []))
      pagesConfigs.push(...(feature.pages ?? []))
      tablesConfigs.push(...(feature.tables ?? []))
    }
    const specs = SpecMapper.toManyEntities(specsConfigs, spec)
    const pages = PageMapper.toManyEntities(pagesConfigs, page)
    const tables = TableMapper.toManyEntities(tablesConfigs, table)
    const roles = RoleMapper.toManyEntities(rolesConfigs, undefined)
    const logger = newLogger(`app:${name}`)
    return new App({
      name,
      specs,
      pages,
      tables,
      roles,
      server,
      logger,
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
    return this.toEntity(config, { table, page, spec, newLogger, server })
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
        if (instancePath === '/translations')
          return new AppError('TRANSLATIONS_ARRAY_TYPE_REQUIRED')
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
