import { Modal } from '@domain/entities/Component/application/Modal'
import type { Config } from '@adapter/api/configs/Component/application/Modal'
import { ButtonMapper } from '../base/ButtonMapper'
import { ComponentMapper, type Services } from '@adapter/api/mappers/ComponentMapper'

export class ModalMapper {
  static toEntity = (config: Config, services: Services): Modal => {
    const { components } = services
    const button = ButtonMapper.toEntity(config.button, services)
    const header = config.header
      ? ComponentMapper.toManyEntities(config.header, services)
      : undefined
    const body = ComponentMapper.toManyEntities(config.body, services)
    const footer = config.footer
      ? ComponentMapper.toManyEntities(config.footer, services)
      : undefined
    return new Modal({ ...config, header, body, footer, button, Component: components.Modal })
  }
}
