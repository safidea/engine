import { ParagraphDto } from '@application/dtos/page/components/ParagraphDto'
import { Paragraph } from '@domain/entities/page/components/Paragraph'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export function mapDtoToParagraph(paragraphDto: ParagraphDto, ui: IUIGateway): Paragraph {
  return new Paragraph(paragraphDto.text, ui.ParagraphUI)
}
