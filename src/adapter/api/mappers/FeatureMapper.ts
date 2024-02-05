import { Feature } from '@domain/entities/feature/Feature'
import { FeatureError, type FeatureErrorCode } from '@domain/entities/feature/FeatureError'
import { Services } from '@domain/services'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import type { Feature as FeatureConfig } from '../configs/Feature'
import type { Mapper } from './Mapper'
import { SpecMapper } from './spec/SpecMapper'
import { PageMapper } from './page/PageMapper'
import { TableMapper } from './table/TableMapper'
import type { EngineError } from '@domain/entities/EngineError'

export const FeatureMapper: Mapper<FeatureConfig, EngineError, Feature> = class FeatureMapper {
  static getPaths = (instancePath: string): string[] => {
    return instancePath.split('/').filter((item) => item !== '')
  }

  static getFirstPath = (instancePath: string): string => {
    return this.getPaths(instancePath)[0]
  }

  static toEntity = (dto: FeatureConfig, services: Services) => {
    const specs = SpecMapper.toManyEntities(dto.specs ?? [], services, dto.name)
    const pages = PageMapper.toManyEntities(dto.pages ?? [], services, dto.name)
    const tables = TableMapper.toManyEntities(dto.tables ?? [], services, dto.name)
    const server = services.server()
    return new Feature({
      name: dto.name,
      role: dto.role,
      specs,
      pages,
      tables,
      server,
      roles: [],
    })
  }

  static toManyEntities = (dtos: FeatureConfig[], services: Services) => {
    return dtos.map((dto) => this.toEntity(dto, services))
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
