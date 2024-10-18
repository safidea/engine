import { TitleMapper } from './TitleMapper'
import { TextMapper } from './TextMapper'
import { UrlMapper } from './UrlMapper'
import { AttributeMapper } from './AttributeMapper'
import { InputTextMapper } from './InputTextMapper'
import type { Expect as Config } from '@adapter/api/configs/Expect'
import type { Expect } from '@domain/entities/Expect'
import { RecordMapper } from './RecordMapper'
import { EmailMapper } from './EmailMapper'
import { EqualMapper } from './EqualMapper'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { ExistMapper } from './ExistMapper'

interface Services {
  templateCompiler: TemplateCompiler
}

export class ExpectMapper {
  static toEntity = (config: Config, services: Services): Expect => {
    const { expect } = config
    if (expect === 'Title') return TitleMapper.toEntity(config)
    if (expect === 'Text') return TextMapper.toEntity(config)
    if (expect === 'Url') return UrlMapper.toEntity(config)
    if (expect === 'Attribute') return AttributeMapper.toEntity(config)
    if (expect === 'InputText') return InputTextMapper.toEntity(config)
    if (expect === 'Record') return RecordMapper.toEntity(config)
    if (expect === 'Email') return EmailMapper.toEntity(config)
    if (expect === 'Equal') return EqualMapper.toEntity(config, services)
    if (expect === 'Exist') return ExistMapper.toEntity(config, services)
    throw new Error(`ExpectMapper: expect "${expect}" not found`)
  }

  static toManyEntities = (configs: Config[], services: Services): Expect[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
