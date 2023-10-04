import React from 'react'
import { describe, test, expect } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { Page } from './Page'
import { Context } from './context/Context'
import { UIService } from '@entities/services/ui/UIService'
import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { getUIDriver } from '@drivers/ui'
import { getIconDriver } from '@drivers/icon'

describe('Page', () => {
  test('should render react component', async () => {
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
        ui: new UIService(new UIMapper(getUIDriver('unstyled', getIconDriver()))),
      } as any,
      {} as any
    ).render(new Context({ path: { params: {} } }))

    // WHEN
    render(<PageRender />)

    // THEN
    const element = screen.getByText('Hello World')
    expect(element).toBeDefined()
  })
})
