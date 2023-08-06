import { TitleDto } from '@adapter/api/page/dtos/components/TitleDto'
import { Title } from '@domain/entities/page/components/Title'
import { UI } from '@adapter/spi/ui/UI'

export class TitleMapper {
  static toEntity(titleDto: TitleDto, ui: UI): Title {
    return new Title(titleDto.text, ui.TitleUI, titleDto.size)
  }

  static toDto(title: Title): TitleDto {
    return {
      type: 'title',
      text: title.text,
      size: title.size,
    }
  }

  static toEntities(titleDtos: TitleDto[], ui: UI): Title[] {
    return titleDtos.map((titleDto) => this.toEntity(titleDto, ui))
  }

  static toDtos(titles: Title[]): TitleDto[] {
    return titles.map((title) => this.toDto(title))
  }
}
