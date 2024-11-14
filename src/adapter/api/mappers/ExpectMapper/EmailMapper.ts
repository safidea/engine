import type { Email as Config } from '@adapter/api/configs/Expect/Email'
import { Email } from '@domain/entities/Expect/Email'

export class EmailMapper {
  static toEntity = (config: Config): Email => {
    return new Email(config)
  }
}
