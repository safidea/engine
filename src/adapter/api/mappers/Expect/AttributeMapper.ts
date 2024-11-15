import { AttributeExpect, type AttributeExpectConfig } from '@domain/entities/Expect/Attribute'

export class AttributeExpectMapper {
  static toEntity = (config: AttributeExpectConfig): AttributeExpect => {
    return new AttributeExpect(config)
  }
}
