import { Role } from '@domain/entities/role/Role'
import { RoleError, type RoleErrorCode } from '@domain/entities/role/RoleError'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import type { Role as RoleConfig } from '../configs/Role'
import type { Mapper } from './Mapper'

export const RoleMapper: Mapper<RoleConfig, RoleError, Role> = class RoleMapper {
  static toEntity = (config: RoleConfig) => {
    return new Role(config)
  }

  static toManyEntities = (configs: RoleConfig[]) => {
    return configs.map(this.toEntity)
  }

  static toErrorEntity = (errorDto: SchemaValidatorErrorDto) => {
    const { instancePath, keyword, params } = errorDto
    if (keyword === 'required') {
      if (params.missingProperty === 'name') return new RoleError('NAME_REQUIRED')
    } else if (keyword === 'additionalProperties') {
      return new RoleError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
    } else if (keyword === 'type') {
      if (instancePath === '/name') return new RoleError('NAME_STRING_TYPE_REQUIRED')
    }
    return new RoleError('UNKNOWN_SCHEMA_ERROR')
  }

  static toManyErrorEntities = (errorDtos: SchemaValidatorErrorDto[]) => {
    return errorDtos.map(this.toErrorEntity)
  }

  static toErrorEntityFromCode = (code: RoleErrorCode) => {
    return new RoleError(code)
  }
}
