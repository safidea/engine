import { TitleDto } from '@application/dtos/page/components/TitleDto'
import { Title } from '@domain/entities/page/components/Title'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export function mapDtoToTitle(titleDto: TitleDto, ui: IUIGateway): Title {
  return new Title(titleDto.text, titleDto.size, ui.TitleUI)
}
