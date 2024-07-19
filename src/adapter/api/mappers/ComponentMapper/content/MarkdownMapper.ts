import { Markdown } from '@domain/entities/Component/content/Markdown'
import type { Config } from '@adapter/api/configs/Component/content/Markdown'
import type { ReactComponents } from '@domain/entities/Component'
import type { MarkdownParser } from '@domain/services/MarkdownParser'

interface Services {
  components: ReactComponents
  markdownParser: MarkdownParser
}

export class MarkdownMapper {
  static toEntity = (config: Config, services: Services): Markdown => {
    const { markdownParser, components } = services
    return new Markdown({ ...config, markdownParser, Component: components.Markdown })
  }
}
