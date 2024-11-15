import { Header, type Services } from '@domain/entities/Component/marketing/Header'
import type { Config } from '@adapter/api/configs/Component/marketing/Header'
import { TitleMapper } from '../content/TitleMapper'
import { LinkMapper, type LinkServices } from '../content/LinkMapper'
import { DropdownMapper, type DropdownServices } from '../base/DropdownMapper'
import { ButtonMapper, type ButtonServices } from '../base/ButtonMapper'

export type HeaderServices = Services & LinkServices & DropdownServices & ButtonServices

export class HeaderMapper {
  static toEntity = (config: Config, services: HeaderServices): Header => {
    const title = TitleMapper.toEntity(config.title, services)
    const links = config.links.map((link) =>
      'links' in link
        ? DropdownMapper.toEntity(link, services)
        : LinkMapper.toEntity(link, services)
    )
    const buttons = ButtonMapper.toManyEntities(config.buttons, services)
    return new Header(config, services, { title, links, buttons })
  }
}
