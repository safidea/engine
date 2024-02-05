import { Spec } from '@domain/entities/spec/Spec'
import { SpecError, type SpecErrorCode } from '@domain/entities/spec/SpecError'
import { Services } from '@domain/services'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import type { SpecDto } from '../../dtos/spec/SpecDto'
import type { Mapper } from '../Mapper'
import { ActionMapper } from './ActionMapper'
import { ResultMapper } from './ResultMapper'

export const SpecMapper: Mapper<SpecDto, SpecError, Spec> = class SpecMapper {
  static toEntity = (dto: SpecDto, services: Services, feature: string) => {
    const newServer = () => services.server()
    const newDatabase = () => services.database()
    const newBrowser = () => services.browser()
    const logger = services.logger(`feature:${feature}:spec:${dto.name}`)
    const params = { logger, feature, spec: dto.name }
    const when = ActionMapper.toEntities(dto.when, params)
    const then = ResultMapper.toEntities(dto.then, params)
    return new Spec(
      {
        name: dto.name,
        when,
        then,
      },
      { newServer, newDatabase, newBrowser, logger, feature }
    )
  }

  static toEntities = (dtos: SpecDto[], services: Services, feature: string) => {
    return dtos.map((dto) => this.toEntity(dto, services, feature))
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

  static toErrorEntities = (errorDtos: SchemaValidatorErrorDto[]) => {
    return errorDtos.map(this.toErrorEntity)
  }

  static toErrorEntityFromCode = (code: SpecErrorCode) => {
    return new SpecError(code)
  }
}
