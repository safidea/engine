import { TitleExpect, type TitleExpectConfig } from '@domain/entities/Expect/Title'

export class TitleExpectMapper {
  static toEntity = (config: TitleExpectConfig): TitleExpect => {
    return new TitleExpect(config)
  }
}
