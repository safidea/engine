import {
  Heading,
  type Services as HeadingServices,
} from '@domain/entities/Component/application/Heading'
import { ButtonMapper, type ButtonServices } from '../base/ButtonMapper'
import { TitleMapper } from '../content/TitleMapper'
import type { Config } from '@adapter/api/configs/Component/application/Heading'

export type Services = HeadingServices & ButtonServices

export class HeadingMapper {
  static toEntity = (config: Config, services: Services): Heading => {
    const title = TitleMapper.toEntity(config.title, services)
    const buttons = config.buttons
      ? ButtonMapper.toManyEntities(config.buttons, services)
      : undefined
    return new Heading(config, services, { title, buttons })
  }
}
