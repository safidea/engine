import { TitleMapper } from './TitleMapper'
import { Logger } from '@domain/services/Logger'
import { TextMapper } from './TextMapper'
import { UrlMapper } from './UrlMapper'
import { AttributeMapper } from './AttributeMapper'
import { InputTextMapper } from './InputTextMapper'
import type { Expect as Config } from '@adapter/api/configs/Expect'
import type { Expect } from '@domain/entities/Expect'
import { RecordMapper } from './RecordMapper'
import { EmailMapper } from './EmailMapper'

interface Services {
  logger: Logger
}

export class ExpectMapper {
  static toEntity = (config: Config, services: Services): Expect => {
    const { expect } = config
    if (expect === 'Title') return TitleMapper.toEntity(config, services)
    if (expect === 'Text') return TextMapper.toEntity(config, services)
    if (expect === 'Url') return UrlMapper.toEntity(config, services)
    if (expect === 'Attribute') return AttributeMapper.toEntity(config, services)
    if (expect === 'InputText') return InputTextMapper.toEntity(config, services)
    if (expect === 'Record') return RecordMapper.toEntity(config, services)
    if (expect === 'Email') return EmailMapper.toEntity(config, services)
    throw new Error(`ExpectMapper: expect "${expect}" not found`)
  }

  static toManyEntities = (configs: Config[], services: Services): Expect[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
