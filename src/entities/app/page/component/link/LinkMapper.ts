import { LinkDto } from '@adapters/api/page/dtos/components/LinkDto'
import { Link } from '@entities/app/page/component/common/link/Link'
import { IUISpi } from '@entities/app/page/IUISpi'

export class LinkMapper {
  static toEntity(linkDto: LinkDto, ui: IUISpi): Link {
    return new Link(linkDto.path, linkDto.label, ui.LinkUI)
  }

  static toDto(link: Link): LinkDto {
    return {
      type: 'link',
      path: link.path,
      label: link.label,
    }
  }

  static toEntities(linkDtos: LinkDto[], ui: IUISpi): Link[] {
    return linkDtos.map((linkDto) => this.toEntity(linkDto, ui))
  }

  static toDtos(links: Link[]): LinkDto[] {
    return links.map((link) => this.toDto(link))
  }
}
