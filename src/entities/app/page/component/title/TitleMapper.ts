import { TitleComponentDto } from '@adapters/api/page/dtos/components/TitleComponentDto'
import { TitleComponent } from '@entities/app/page/component/common/title/TitleComponent'
import { IUISpi } from '@entities/app/page/IUISpi'

export class TitleMapper {
  static toEntity(titleDto: TitleComponentDto, ui: IUISpi): TitleComponent {
    return new TitleComponent(titleDto.text, ui.TitleUI, titleDto.size)
  }

  static toDto(title: TitleComponent): TitleComponentDto {
    return {
      type: 'title',
      text: title.text,
      size: title.size,
    }
  }

  static toEntities(titleDtos: TitleComponentDto[], ui: IUISpi): TitleComponent[] {
    return titleDtos.map((titleDto) => this.toEntity(titleDto, ui))
  }

  static toDtos(titles: TitleComponent[]): TitleComponentDto[] {
    return titles.map((title) => this.toDto(title))
  }
}
