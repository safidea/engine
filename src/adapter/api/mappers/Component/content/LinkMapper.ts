import { Link, type Services } from '@domain/entities/Component/content/Link'
import type { Config } from '@adapter/api/configs/Component/content/Link'
import { IconMapper, type IconServices } from './IconMapper'

export type LinkServices = Services & IconServices

export class LinkMapper {
  static toEntity = (config: Config, services: LinkServices): Link => {
    const prefixIcon = config.prefixIcon
      ? IconMapper.toEntity(config.prefixIcon, services)
      : undefined
    const suffixIcon = config.suffixIcon
      ? IconMapper.toEntity(config.suffixIcon, services)
      : undefined
    return new Link(config, services, { prefixIcon, suffixIcon })
  }

  static toManyEntities = (configs: Config[], services: LinkServices): Link[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
