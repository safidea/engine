import { EmailField } from '@domain/entities/Field/Email'
import type { IEmailField } from '@adapter/api/configs/Field/Email'

export class EmailFieldMapper {
  static toEntity = (config: IEmailField): EmailField => {
    return new EmailField(config)
  }

  static toManyEntities = (configs: IEmailField[]): EmailField[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
