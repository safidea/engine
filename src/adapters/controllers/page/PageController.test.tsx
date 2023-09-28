import { AppMapper } from '@adapters/mappers/app/AppMapper'
import { PageController } from './PageController'
import { describe, expect, test } from 'bun:test'
import { getUIDriver } from '@drivers/ui'
import { Page } from '@entities/app/page/Page'
import { Context } from '@entities/app/page/context/Context'
import { getFetcherDriver } from '@drivers/fetcher'

describe('PageController', () => {
  test('should render html', async () => {
    // GIVEN
    const app = AppMapper.toServerApp(
      {
        pages: [
          {
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
        ui: getUIDriver('unstyled'),
        fetcher: getFetcherDriver('native', { domain: 'http://localhost' }),
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
