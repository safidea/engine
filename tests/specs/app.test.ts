import { test, expect } from '@playwright/test'
import { createApp, type IApp } from '@solumy/engine'

test.describe('App specs', () => {
  test('should not find a text', async () => {
    // GIVEN
    const config: IApp = {
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
    const { errors } = await createApp(config)

    // THEN
    expect(errors).toHaveLength(1)
    expect(errors[0].code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
  })

  test('should find a text', async () => {
    // GIVEN
    const config: IApp = {
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
    const { errors } = await createApp(config)

    // THEN
    expect(errors).toHaveLength(0)
  })

  test('should test specs by default when starting the app', async () => {
    // GIVEN
    const config: IApp = {
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
    const { errors } = await createApp(config)

    // THEN
    expect(errors).toHaveLength(1)
    expect(errors[0].code).toBe('SPEC_ERROR_TEXT_NOT_FOUND')
  })

  test('should not test specs when starting the app', async () => {
    // GIVEN
    const config: IApp = {
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
    const { errors } = await createApp(config, { testSpecs: false })

    // THEN
    expect(errors).toHaveLength(0)
  })
})
