import { Page } from '@domain/entities/Page'
import { PageError, type PageErrorCode } from '@domain/entities/PageError'
import { Services } from '@domain/services'
import type { PageDto } from '../dtos/PageDto'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import { ComponentMapper } from './ComponentMapper'
import { HeadMapper } from './HeadMapper'
import type { Mapper } from './Mapper'

export const PageMapper: Mapper<PageDto, PageError, Page> = class PageMapper {
  static toEntity = (dto: PageDto, services: Services) => {
    const server = services.server()
    const ui = services.ui()
    const logger = services.logger(`page:${dto.name}`)
    const body = ComponentMapper.toManyEntities(dto.body, services.components)
    const head = HeadMapper.toEntity(dto.head)
    return new Page({ ...dto, head, body }, { server, logger, ui, Html: services.components.Html })
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

  static toErrorEntities = (errorDtos: SchemaValidatorErrorDto[]) => {
    return errorDtos.map(this.toErrorEntity)
  }

  static toErrorEntityFromCode = (code: PageErrorCode) => {
    return new PageError(code)
  }
}
