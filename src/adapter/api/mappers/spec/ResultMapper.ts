import type { ResultDto } from '@adapter/api/dtos/spec/ResultDto'
import type { Result } from '@domain/entities/spec/Result'
import { Title } from '@domain/entities/spec/Result/Title'
import { Text } from '@domain/entities/spec/Result/Text'
import { InputText } from '@domain/entities/spec/Result/InputText'
import { Record } from '@domain/entities/spec/Result/Record'
import type { BaseParams as ResultParams } from '@domain/entities/spec/Result/base'

export class ResultMapper {
  static toEntity = (dto: ResultDto, params: ResultParams): Result => {
    if ('title' in dto) {
      return new Title(dto, params)
    }
    if ('text' in dto) {
      return new Text(dto, params)
    }
    if ('input' in dto) {
      return new InputText(dto, params)
    }
    if ('record' in dto) {
      return new Record(dto, params)
    }
    throw new Error('Unknown result type')
  }

  static toEntities = (dtos: ResultDto[], params: ResultParams): Result[] => {
    return dtos.map((dto) => this.toEntity(dto, params))
  }
}
