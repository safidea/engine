import { test, expect } from '@playwright/test'
import App, { type Config } from '@solumy/engine'

test.describe('App specs', () => {
  test('should succeed to test a spec', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'Feature',
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
      features: [
        {
          name: 'Feature',
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
