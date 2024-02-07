import { Page } from '@domain/entities/page/Page'
import { PageError, type PageErrorCode } from '@domain/entities/page/PageError'
import { Services } from '@domain/services'
import type { Page as PageConfig } from '../../configs/page/Page'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import { ComponentMapper } from './ComponentMapper'
import { HeadMapper } from './HeadMapper'
import type { Mapper } from '../Mapper'
import type { Server } from '@domain/services/Server'
import type { Ui } from '@domain/services/Ui'
import type { Logger } from '@domain/services/Logger'
import type { ReactComponents } from '@domain/entities/page/component'
import type { IdGenerator } from '@domain/services/IdGenerator'

export interface Params {
  server: Server
  ui: Ui
  idGenerator: IdGenerator
  newLogger: (location: string) => Logger
  components: ReactComponents
}

export const PageMapper: Mapper<PageConfig, PageError, Page, Params> = class PageMapper {
  static toEntity = (config: PageConfig, params: Params): Page => {
    const { name, path } = config
    const { server, newLogger, ui, components, idGenerator } = params
    const logger = newLogger(`page:${config.name}`)
    const body = ComponentMapper.toManyEntities(config.body, {
      components,
      server,
      ui,
      idGenerator,
    })
    const head = HeadMapper.toEntity(config.head ?? {})
    return new Page({ name, path, head, body, server, logger, ui, Html: components.Html })
  }

  static toManyEntities = (configs: PageConfig[], params: Params) => {
    return configs.map((config) => this.toEntity(config, params))
  }

  static toEntityFromServices = (config: PageConfig, services: Services) => {
    const ui = services.ui()
    const server = services.server({
      logger: services.logger({ location: `server` }),
    })
    const idGenerator = services.idGenerator()
    const newLogger = (location: string) => services.logger({ location })
    return this.toEntity(config, {
      server,
      newLogger,
      ui,
      components: services.components,
      idGenerator,
    })
  }

  static toManyEntitiesFromServices = (configs: PageConfig[], services: Services) => {
    return configs.map((config) => this.toEntityFromServices(config, services))
  }

  static toErrorEntity = (errorDto: SchemaValidatorErrorDto) => {
    const { instancePath, keyword, params } = errorDto
    if (keyword === 'required') {
      if (params.missingProperty === 'name') return new PageError('NAME_REQUIRED')
      if (params.missingProperty === 'path') return new PageError('PATH_REQUIRED')
      if (params.missingProperty === 'body') return new PageError('BODY_REQUIRED')
    } else if (keyword === 'additionalProperties') {
      return new PageError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
    } else if (keyword === 'type') {
      if (instancePath === '/name') return new PageError('NAME_STRING_TYPE_REQUIRED')
    }
    return new PageError('UNKNOWN_SCHEMA_ERROR')
  }

  static toManyErrorEntities = (errorDtos: SchemaValidatorErrorDto[]) => {
    return errorDtos.map(this.toErrorEntity)
  }

  static toErrorEntityFromCode = (code: PageErrorCode) => {
    return new PageError(code)
  }
}
