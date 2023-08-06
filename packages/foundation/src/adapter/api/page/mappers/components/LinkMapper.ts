import { LinkDto } from '@adapter/api/page/dtos/components/LinkDto'
import { Link } from '@domain/entities/page/components/Link'
import { UI } from '@adapter/spi/ui/UI'

export class LinkMapper {
  static toEntity(linkDto: LinkDto, ui: UI): Link {
    return new Link(linkDto.path, linkDto.label, ui.LinkUI)
  }

  static toDto(link: Link): LinkDto {
    return {
      type: 'link',
      path: link.path,
      label: link.label,
    }
  }

  static toEntities(linkDtos: LinkDto[], ui: UI): Link[] {
    return linkDtos.map((linkDto) => this.toEntity(linkDto, ui))
  }

  static toDtos(links: Link[]): LinkDto[] {
    return links.map((link) => this.toDto(link))
  }
}
