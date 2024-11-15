import { Dropdown, type Services } from '@domain/entities/Component/base/Dropdown'
import { LinkMapper, type LinkServices } from '../content/LinkMapper'
import type { Config } from '@adapter/api/configs/Component/base/Dropdown'

export type DropdownServices = Services & LinkServices

export class DropdownMapper {
  static toEntity = (config: Config, services: DropdownServices): Dropdown => {
    const links = LinkMapper.toManyEntities(config.links, services)
    return new Dropdown(config, services, { links })
  }
}
