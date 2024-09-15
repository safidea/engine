import { Modal } from '@domain/entities/Component/application/Modal'
import type { Config } from '@adapter/api/configs/Component/application/Modal'
import { ButtonMapper } from '../base/ButtonMapper'
import {
  ComponentMapper,
  type ComponentEntities,
  type ComponentServices,
} from '@adapter/api/mappers/ComponentMapper'

export class ModalMapper {
  static toEntity = (
    config: Config,
    services: ComponentServices,
    entities: ComponentEntities
  ): Modal => {
    const button = ButtonMapper.toEntity(config.button, services)
    const header = config.header
      ? ComponentMapper.toManyEntities(config.header, services, entities)
      : undefined
    const body = ComponentMapper.toManyEntities(config.body, services, entities)
    const footer = config.footer
      ? ComponentMapper.toManyEntities(config.footer, services, entities)
      : undefined
    return new Modal(config, services, {
      button,
      header,
      body,
      footer,
    })
  }
}
