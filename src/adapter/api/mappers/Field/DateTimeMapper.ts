import type { IDateTimeField } from '@adapter/api/configs/Field/DateTime'
import { DateTimeField } from '@domain/entities/Field/DateTime'

export class DateTimeFieldMapper {
  static toEntity = (config: IDateTimeField): DateTimeField => {
    return new DateTimeField(config)
  }

  static toManyEntities = (configs: IDateTimeField[]): DateTimeField[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
