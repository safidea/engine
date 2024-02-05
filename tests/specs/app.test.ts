import { test, expect } from '@playwright/test'
import App, { type Config } from '@solumy/engine'

test.describe('App specs', () => {
  test('should not find a text', async () => {
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
    const errors = new App(config).getErrors()

    // THEN
    expect(errors).toHaveLength(1)
    expect(errors[0].code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
  })

  test('should find a text', async () => {
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
    const errors = new App(config).getErrors()

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should no test specs by default when starting the app', async () => {
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
    const errors = new App(config).getErrors()

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should test specs', async () => {
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
    const errors = await new App(config).test()

    // THEN
    expect(errors).toHaveLength(1)
    expect(errors[0].code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
  })
})
