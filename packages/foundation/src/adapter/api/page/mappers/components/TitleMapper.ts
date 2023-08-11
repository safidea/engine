import { TitleDto } from '@adapter/api/page/dtos/components/TitleDto'
import { Title } from '@domain/entities/page/components/Title'
import { IUISpi } from '@domain/spi/IUISpi'

export class TitleMapper {
  static toEntity(titleDto: TitleDto, ui: IUISpi): Title {
    return new Title(titleDto.text, ui.TitleUI, titleDto.size)
  }

  static toDto(title: Title): TitleDto {
    return {
      type: 'title',
      text: title.text,
      size: title.size,
    }
  }

  static toEntities(titleDtos: TitleDto[], ui: IUISpi): Title[] {
    return titleDtos.map((titleDto) => this.toEntity(titleDto, ui))
  }

  static toDtos(titles: Title[]): TitleDto[] {
    return titles.map((title) => this.toDto(title))
  }
}
