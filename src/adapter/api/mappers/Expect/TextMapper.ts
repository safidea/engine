import { TextExpect, type TextExpectConfig } from '@domain/entities/Expect/Text'

export class TextExpectMapper {
  static toEntity = (config: TextExpectConfig): TextExpect => {
    return new TextExpect(config)
  }
}
