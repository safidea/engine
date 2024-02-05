import type { EngineError } from '@domain/entities/EngineError'
import type { SchemaValidatorErrorDto } from '../../spi/dtos/SchemaValidatorErrorDto'
import { TableMapper } from '@adapter/api/mappers/table/TableMapper'
import { PageMapper } from '@adapter/api/mappers/page/PageMapper'

export const EngineMapper = class EngineMapper {
  static toErrorEntity = (errorDto: SchemaValidatorErrorDto): EngineError => {
    switch (errorDto.schema) {
      case 'table':
        return TableMapper.toErrorEntity(errorDto)
      case 'page':
        return PageMapper.toErrorEntity(errorDto)
      default:
        throw new Error('Unknown schema')
    }
  }

  static toManyErrorEntities = (errorDtos: SchemaValidatorErrorDto[]): EngineError[] => {
    return errorDtos.map((errorDto) => this.toErrorEntity(errorDto))
  }
}
