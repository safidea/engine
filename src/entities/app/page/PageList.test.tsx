import React from 'react'
import { describe, test, expect } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { UIService } from '@entities/services/ui/UIService'
import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { getUIDriver } from '@drivers/ui'
import { getIconDriver } from '@drivers/icon'
import { PageList } from './PageList'
import { FetcherService } from '@entities/services/fetcher/FetcherService'
import { FetcherMapper } from '@adapters/mappers/fetcher/FetcherMapper'
import { getFetcherDriver } from '@drivers/fetcher'
import { IconService } from '@entities/services/icon/IconService'
import { IconMapper } from '@adapters/mappers/driver/IconMapper'

describe('PageList', () => {
  test('should render page from path', async () => {
    // GIVEN
    const pages = new PageList(
      [
        {
          path: '/',
          title: 'test',
          components: [
            {
              type: 'paragraph',
              text: 'Hello PageList!',
            },
          ],
        },
      ],
      {
        ui: new UIService(new UIMapper(getUIDriver('unstyled', getIconDriver()))),
        fetcher: new FetcherService(
          new FetcherMapper(getFetcherDriver('native', { domain: 'http://localhost' }))
        ),
        icon: new IconService(new IconMapper(getIconDriver())),
      } as any,
      {} as any
    )

    // WHEN
    const Page = await pages.renderByPath('/')
    render(<Page />)

    // THEN
    const element = screen.getByText('Hello PageList!')
    expect(element).toBeDefined()
  })
})
