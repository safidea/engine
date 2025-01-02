import { test, expect, NodeApp } from '@test/fixtures'
import { type CodeRunnerContext, type Config } from '@latechforce/engine'

test('should run an automation from api call', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'ApiCalled',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'run-api',
        },
        actions: [],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

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
          service: 'Http',
          event: 'ApiCalled',
          path: 'run-api',
          output: {
            value: '{{runJs.value}}',
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
  const app = new NodeApp()
  const { url } = await app.start(config)

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
          service: 'Http',
          event: 'ApiCalled',
          path: 'error',
        },
        actions: [
          {
            name: 'throwError',
            service: 'Code',
            action: 'RunJavascript',
            input: {
              message,
            },
            code: String(function (context: CodeRunnerContext<{ message: string }>) {
              const { inputData } = context
              throw new Error(inputData.message)
            }),
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/error`)

  // THEN
  const { error } = await response.json()
  expect(response.status()).toBe(400)
  expect(error).toContain(message)
})

test('should validate an optional input', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'Theme',
    automations: [
      {
        name: 'throwError',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'input',
          input: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
            },
          },
        },
        actions: [],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/input`)

  // THEN
  expect(response.status()).toBe(200)
})

test('should not validate an required input', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'Theme',
    automations: [
      {
        name: 'throwError',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'input',
          input: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
            },
            required: ['message'],
          },
        },
        actions: [],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/input`)

  // THEN
  expect(response.status()).toBe(400)
})
