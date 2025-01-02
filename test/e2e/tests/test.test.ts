import { test, expect, NodeApp } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

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
  const app = new NodeApp()

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
  const app = new NodeApp()

  // WHEN
  const call = () => app.test(config)

  // THEN
  await expect(call()).rejects.toThrowError('TEXT_NOT_FOUND')
})
