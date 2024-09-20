import { Page, type Services } from '@domain/entities/Page'
import type { Page as Config } from '@adapter/api/configs/Page'
import { ComponentMapper, type ComponentServices, type ComponentEntities } from './ComponentMapper'
import { HeadMapper } from './HeadMapper'

export type PageServices = ComponentServices & Services

export type PageEntities = ComponentEntities

export class PageMapper {
  static toEntity = (config: Config, services: PageServices, entities: PageEntities): Page => {
    const { client } = services
    const body = ComponentMapper.toManyEntities(config.body, services, entities)
    const head = HeadMapper.toEntity(config.head ?? {}, { client })
    return new Page(config, services, { head, body })
  }

  static toManyEntities = (
    configs: Config[] = [],
    services: PageServices,
    entities: PageEntities
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
