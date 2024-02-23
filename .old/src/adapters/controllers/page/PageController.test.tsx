import { AppMapper } from '@adapters/mappers/app/AppMapper'
import { PageController } from './PageController'
import { describe, expect, test } from 'bun:test'
import { getUIDriver } from '@drivers/ui'
import { Page } from '@entities/app/page/Page'
import { Context } from '@entities/app/page/context/Context'
import { getFetcherDriver } from '@drivers/fetcher'
import { getIconDriver } from '@drivers/icon'

describe('PageController', () => {
  test('should render html', async () => {
    // GIVEN
    const icon = getIconDriver()
    const app = AppMapper.toServerApp(
      {
        pages: [
          {
            name: 'test',
            path: '/',
            title: 'test',
            components: [
              {
                type: 'paragraph',
                text: 'Hello World!',
              },
            ],
          },
        ],
      },
      {
        ui: getUIDriver('unstyled', icon),
        fetcher: getFetcherDriver('native', { domain: 'http://localhost' }),
        icon,
      } as any
    )
    const page = app.pages.getByPath('/') as Page

    // WHEN
    const html = await new PageController(app).renderHtml(
      page,
      new Context({ path: { params: {} } })
    )

    // THEN
    expect(html).toContain('<p>Hello World!</p>')
  })
})
