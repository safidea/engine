import { Paragraph, type Services } from '@domain/entities/Component/content/Paragraph'
import type { Config } from '@adapter/api/configs/Component/content/Paragraph'

export class ParagraphMapper {
  static toEntity = (config: Config, services: Services): Paragraph => {
    return new Paragraph(config, services)
  }
}
