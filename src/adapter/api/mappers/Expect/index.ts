import type { IExpect } from '@adapter/api/configs/Expect'
import type { Expect } from '@domain/entities/Expect'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { AttributeExpectMapper } from './AttributeMapper'
import { EmailExpectMapper } from './EmailMapper'
import { EqualExpectMapper } from './EqualMapper'
import { ExistExpectMapper } from './ExistMapper'
import { InputTextExpectMapper } from './InputTextMapper'
import { RecordExpectMapper } from './RecordMapper'
import { TextExpectMapper } from './TextMapper'
import { TitleExpectMapper } from './TitleMapper'
import { UrlExpectMapper } from './UrlMapper'

interface ExpectMapperServices {
  templateCompiler: TemplateCompiler
}

export class ExpectMapper {
  static toEntity = (config: IExpect, services: ExpectMapperServices): Expect => {
    const { expect } = config
    if (expect === 'Title') return TitleExpectMapper.toEntity(config)
    if (expect === 'Text') return TextExpectMapper.toEntity(config)
    if (expect === 'Url') return UrlExpectMapper.toEntity(config)
    if (expect === 'Attribute') return AttributeExpectMapper.toEntity(config)
    if (expect === 'InputText') return InputTextExpectMapper.toEntity(config)
    if (expect === 'Record') return RecordExpectMapper.toEntity(config)
    if (expect === 'Email') return EmailExpectMapper.toEntity(config)
    if (expect === 'Equal') return EqualExpectMapper.toEntity(config, services)
    if (expect === 'Exist') return ExistExpectMapper.toEntity(config, services)
    throw new Error(`ExpectMapper: expect "${expect}" not found`)
  }

  static toManyEntities = (configs: IExpect[], services: ExpectMapperServices): Expect[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
