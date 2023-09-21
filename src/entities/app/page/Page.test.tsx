/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Page } from './Page'
import { Context } from './context/Context'
import { UIService } from '@entities/services/ui/UIService'
import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { getUIDriver } from '@drivers/ui'

describe('Page', () => {
  test('should render html', async () => {
    // GIVEN
    const PageRender = await new Page(
      {
        path: '/',
        title: 'test',
        components: [
          {
            type: 'paragraph',
            text: 'Hello World',
          },
        ],
      },
      {
        ui: new UIService(new UIMapper(getUIDriver('unstyled'))),
      } as any,
      {} as any
    ).render(new Context({ path: { params: {} } }))

    // WHEN
    render(<PageRender />)

    // THEN
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
