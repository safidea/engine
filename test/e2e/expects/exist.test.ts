import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test.describe('Exist expect', () => {
  test('should return a success exist', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'exist',
          when: [
            {
              name: 'request',
              event: 'Post',
              path: '/api/automation/exist',
            },
          ],
          then: [
            {
              expect: 'Exist',
              value: '{{request.exist}}',
            },
          ],
        },
      ],
      automations: [
        {
          name: 'exist',
          trigger: {
            service: 'Http',
            event: 'ApiCalled',
            path: 'exist',
            output: {
              exist: '{{runJavascriptCode.exist}}',
            },
          },
          actions: [
            {
              service: 'Code',
              action: 'RunJavascript',
              name: 'runJavascriptCode',
              // eslint-disable-next-line
              // @ts-ignore
              code: String(async function () {
                return { exist: 'true' }
              }),
            },
          ],
        },
      ],
    }

    // WHEN
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
  })

  test('should return a failed equal', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'exist',
          when: [
            {
              name: 'request',
              event: 'Post',
              path: '/api/automation/exist',
            },
          ],
          then: [
            {
              expect: 'Exist',
              value: '{{request.exist}}',
            },
          ],
        },
      ],
      automations: [
        {
          name: 'exist',
          trigger: {
            service: 'Http',
            event: 'ApiCalled',
            path: 'exist',
            output: {
              exist: '{{runJavascriptCode.exist}}',
            },
          },
          actions: [
            {
              service: 'Code',
              action: 'RunJavascript',
              name: 'runJavascriptCode',
              // eslint-disable-next-line
              // @ts-ignore
              code: String(async function () {
                return { exist: '' }
              }),
            },
          ],
        },
      ],
    }

    // WHEN
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).rejects.toThrow('EXIST_FAILED')
  })
})
