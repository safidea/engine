import { ParagraphDto } from '@adapter/api/page/dtos/components/ParagraphDto'
import { Paragraph } from '@domain/entities/page/components/Paragraph'
import { UI } from '@adapter/spi/ui/UI'

export class ParagraphMapper {
  static toEntity(paragraphDto: ParagraphDto, ui: UI): Paragraph {
    return new Paragraph(paragraphDto.text, ui.ParagraphUI)
  }

  static toDto(paragraph: Paragraph): ParagraphDto {
    return {
      type: 'paragraph',
      text: paragraph.text,
    }
  }

  static toEntities(paragraphDtos: ParagraphDto[], ui: UI): Paragraph[] {
    return paragraphDtos.map((paragraphDto) => this.toEntity(paragraphDto, ui))
  }

  static toDtos(paragraphs: Paragraph[]): ParagraphDto[] {
    return paragraphs.map((paragraph) => this.toDto(paragraph))
  }
}
