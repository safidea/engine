import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('App specs', () => {
  test.slow()

  test('should succeed to test a spec', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }],
          then: [{ text: 'valid' }],
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

    // WHEN
    const app = new App()
    const errors = await app.test(config)

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should failed to test a spec', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      specs: [
        {
          name: 'display invalid text',
          when: [{ open: '/' }],
          then: [{ text: 'invalid' }],
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

    // WHEN
    const app = new App()
    const errors = await app.test(config)

    // THEN
    expect(errors).toHaveLength(1)
    expect(errors[0].code).toBe('TEXT_NOT_FOUND')
  })
})
