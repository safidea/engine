import { describe, test, expect } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { Context } from '@entities/app/page/context/Context'
import { helpers } from '@test/unit/fixtures'
import Engine from './server'

describe('Server Engine', () => {
  test('should render a page as a react component', async () => {
    // GIVEN
    const config = {
      pages: [
        {
          path: '/',
          title: 'Home',
          components: [
            {
              type: 'title',
              text: 'Hello World!',
            },
          ],
        },
      ],
    }
    const { app } = new Engine(config, { folder: helpers.getDedicatedTmpFolder() })

    // WHEN
    const Page = await app.pages.renderByPath('/', new Context({ path: { params: {} } }))
    render(<Page />)

    // THEN
    const title = screen.getByRole('heading')
    expect(title.innerText).toBe('Hello World!')
  })

  test('should validate a config', async () => {
    // GIVEN
    const config = {
      pages: [
        {
          path: '/',
          title: 'Home',
          components: [
            {
              type: 'title',
              text: 'Hello World!',
            },
          ],
        },
      ],
    }

    // WHEN
    const call = () => Engine.validateConfig(config)

    // THEN
    expect(call).not.toThrow()
  })

  test('should invalidate a config', async () => {
    // GIVEN
    const config = {
      pages: [
        {
          path: '/',
          title: 'Home',
          components: [
            {
              type: 'invalid',
              text: 'Hello World!',
            },
          ],
        },
      ],
    }

    // WHEN
    const call = () => Engine.validateConfig(config)

    // THEN
    expect(call).toThrow('Could not validate config')
  })
})
