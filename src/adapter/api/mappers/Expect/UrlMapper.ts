import { UrlExpect, type UrlExpectConfig } from '@domain/entities/Expect/Url'

export class UrlExpectMapper {
  static toEntity = (config: UrlExpectConfig): UrlExpect => {
    return new UrlExpect(config)
  }
}
