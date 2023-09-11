import { ParagraphDto } from '@adapters/api/page/dtos/components/ParagraphDto'
import { Paragraph } from '@entities/app/page/components/Paragraph'
import { IUISpi } from '@entities/spi/IUISpi'

export class ParagraphMapper {
  static toEntity(paragraphDto: ParagraphDto, ui: IUISpi): Paragraph {
    return new Paragraph(paragraphDto.text, ui.ParagraphUI, paragraphDto.size)
  }

  static toDto(paragraph: Paragraph): ParagraphDto {
    return {
      type: 'paragraph',
      text: paragraph.text,
      size: paragraph.size,
    }
  }

  static toEntities(paragraphDtos: ParagraphDto[], ui: IUISpi): Paragraph[] {
    return paragraphDtos.map((paragraphDto) => this.toEntity(paragraphDto, ui))
  }

  static toDtos(paragraphs: Paragraph[]): ParagraphDto[] {
    return paragraphs.map((paragraph) => this.toDto(paragraph))
  }
}
