import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Test', () => {
  test.slow()

  test('should succeed to test a text', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [{ expect: 'Text', text: 'valid' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'valid',
            },
          ],
        },
      ],
    }
    const app = new App()

    // WHEN
    const call = () => app.test(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
  })

  test('should failed to test a text', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [{ expect: 'Text', text: 'invalid' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'valid',
            },
          ],
        },
      ],
    }
    const app = new App()

    // WHEN
    const call = () => app.test(config)

    // THEN
    await expect(call()).rejects.toThrowError('TEXT_NOT_FOUND')
  })

  test('should run a test with env variables', async () => {
    // GIVEN
    process.env.DATABASE_URL = ':memory:'
    process.env.DATABASE_TYPE = 'sqlite'
    const config: Config = {
      name: 'App',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [{ expect: 'Text', text: 'valid' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'valid',
            },
          ],
        },
      ],
      database: {
        url: '$DATABASE_URL',
        type: '$DATABASE_TYPE',
      },
    }
    const app = new App()

    // WHEN
    const call = () => app.test(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
  })
})
