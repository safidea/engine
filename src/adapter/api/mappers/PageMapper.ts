import { Page, type PageServices } from '@domain/entities/Page'
import type { IPage } from '@adapter/api/configs/Page'
import { ComponentMapper, type ComponentServices, type ComponentEntities } from './Component'
import { HeadMapper } from './HeadMapper'

export type PageMapperServices = ComponentServices & PageServices

export type PageMapperEntities = ComponentEntities

export class PageMapper {
  static toEntity = (
    config: IPage,
    services: PageMapperServices,
    entities: PageMapperEntities
  ): Page => {
    const { client } = services
    const body = ComponentMapper.toManyEntities(config.body, services, entities)
    const head = HeadMapper.toEntity(config.head ?? {}, { client })
    return new Page(config, services, { head, body })
  }

  static toManyEntities = (
    configs: IPage[] = [],
    services: PageMapperServices,
    entities: PageMapperEntities
  ) => {
    if (!configs.find((config) => config.path === '/404')) {
      configs.push({
        name: 'not found',
        path: '/404',
        head: {
          title: '404 not found',
        },
        body: [
          {
            component: 'NotFound',
            id: 'not-found',
            title: { text: "Something's missing." },
            paragraph: {
              text: "Sorry, we can't find that page. You'll find lots to explore on the home page.",
            },
            button: {
              label: 'Back to Homepage',
              href: '/',
            },
          },
        ],
      })
    }
    return configs.map((config) => this.toEntity(config, services, entities))
  }
}
