import { test, expect } from '@tests/fixtures'
import App, { type CodeContext, type Config } from '@safidea/engine'

test.describe('ApiCalled trigger', () => {
  test('should run an automation from api call', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'ApiCalled',
          trigger: {
            event: 'ApiCalled',
            path: 'run-api',
          },
          actions: [],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const res = await request.post(`${url}/api/automation/run-api`)

    // THEN
    expect(res.ok()).toBeTruthy()
    const { success } = await res.json()
    expect(success).toBeTruthy()
  })

  test('should return a value', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'ApiCalled',
          trigger: {
            event: 'ApiCalled',
            path: 'run-api',
            output: {
              value: {
                value: '{{runJs.value}}',
                type: 'string',
              },
            },
          },
          actions: [
            {
              name: 'runJs',
              service: 'Code',
              action: 'RunJavascript',
              code: String(function () {
                return { value: 'success' }
              }),
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const res = await request.post(`${url}/api/automation/run-api`)

    // THEN
    expect(res.ok()).toBeTruthy()
    const { value } = await res.json()
    expect(value).toBe('success')
  })

  test('should return an error', async ({ request }) => {
    // GIVEN
    const message = `Test error for Sentry`
    const config: Config = {
      name: 'Theme',
      automations: [
        {
          name: 'throwError',
          trigger: {
            event: 'ApiCalled',
            path: 'error',
          },
          actions: [
            {
              name: 'throwError',
              service: 'Code',
              action: 'RunJavascript',
              input: {
                message: {
                  type: 'string',
                  value: message,
                },
              },
              code: String(function (context: CodeContext<{ message: string }>) {
                const { inputData } = context
                throw new Error(inputData.message)
              }),
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const response = await request.post(`${url}/api/automation/error`)

    // THEN
    const { error } = await response.json()
    expect(response.status()).toBe(400)
    expect(error).toContain(message)
  })
})
