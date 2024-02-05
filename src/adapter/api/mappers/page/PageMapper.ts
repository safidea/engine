import { Page } from '@domain/entities/page/Page'
import { PageError, type PageErrorCode } from '@domain/entities/page/PageError'
import { Services } from '@domain/services'
import type { Page as PageConfig } from '../../configs/page/Page'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import { ComponentMapper } from './ComponentMapper'
import { HeadMapper } from './HeadMapper'
import type { Mapper } from '../Mapper'

export const PageMapper: Mapper<PageConfig, PageError, Page> = class PageMapper {
  static toEntity = (config: PageConfig, services: Services) => {
    const { name, path } = config
    const server = services.server()
    const ui = services.ui()
    const logger = services.logger(`page:${config.name}`)
    const body = ComponentMapper.toManyEntities(config.body, services.components)
    const head = HeadMapper.toEntity(config.head)
    return new Page({ name, path, head, body, server, logger, ui, Html: services.components.Html })
  }

  static toManyEntities = (configs: PageConfig[], services: Services) => {
    return configs.map((config) => this.toEntity(config, services))
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
