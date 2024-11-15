import { Markdown, type Services } from '@domain/entities/Component/content/Markdown'
import type { Config } from '@adapter/api/configs/Component/content/Markdown'

export type MarkdownServices = Services

export class MarkdownMapper {
  static toEntity = (config: Config, services: Services): Markdown => {
    return new Markdown(config, services)
  }
}
