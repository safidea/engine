import { test, expect } from '@test/fixtures'
import App, { type CodeRunnerContext, type Config } from '@latechforce/engine'
import { nanoid } from 'nanoid'
import fs from 'fs-extra'
import { join } from 'path'

test('should run a TypeScript code', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'hello-name',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'hello-name',
          input: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
            required: ['name'],
          },
          output: {
            message: '{{runJavascriptCode.message}}',
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            input: {
              name: '{{trigger.body.name}}',
            },
            code: String(async function (context: CodeRunnerContext<{ name: string }>) {
              const { name } = context.inputData
              return { message: `Hello ${name}!` }
            }),
          },
        ],
      },
    ],
  }
  const app = new App()
  const url = await app.start(config)

  // WHEN
  const response = await request
    .post(`${url}/api/automation/hello-name`, {
      data: {
        name: 'Joe',
      },
    })
    .then((res) => res.json())

  // THEN
  expect(response.message).toBe('Hello Joe!')
})

test('should run the example TypeScript code', async () => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'hello-name',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'hello-name',
          input: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
            required: ['name'],
          },
          output: {
            message: '{{runJavascriptCode.message}}',
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            input: {
              name: '{{trigger.body.name}}',
            },
            code: String(async function (context: CodeRunnerContext<{ name: string }>) {
              const { name } = context.inputData
              return { message: `Hello ${name}!` }
            }),
          },
        ],
      },
    ],
  }
  const url = await new App().start(config)

  // WHEN
  const response = await fetch(url + '/api/automation/hello-name', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: 'World' }),
  })
  const data = await response.json()

  // THEN
  expect(data.message).toBe('Hello World!')
})

test('should run a Typescript code with env variable', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'getEnv',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'get-env',
          output: {
            NODE_ENV: '{{runJavascriptCode.NODE_ENV}}',
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            env: {
              NODE_ENV: 'test',
            },
            code: String(async function (context: CodeRunnerContext) {
              const { env } = context
              const { NODE_ENV } = env
              return { NODE_ENV }
            }),
          },
        ],
      },
    ],
  }
  const app = new App()
  const url = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/get-env`).then((res) => res.json())

  // THEN
  expect(response.NODE_ENV).toBe('test')
})

test('should run a Typescript code with env variable and not showing them in logs', async ({
  request,
}) => {
  // GIVEN
  const filename = join(process.cwd(), 'tmp', `app-${nanoid()}.log`)
  fs.ensureFileSync(filename)
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'getEnv',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'get-env',
          output: {
            NODE_ENV: '{{runJavascriptCode.NODE_ENV}}',
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            env: {
              NODE_ENV: 'xxx',
            },
            code: String(async function (context: CodeRunnerContext) {
              const { env } = context
              const { NODE_ENV } = env
              return { success: !!NODE_ENV }
            }),
          },
        ],
      },
    ],
    loggers: [
      {
        driver: 'File',
        filename,
      },
    ],
  }
  const app = new App()
  const url = await app.start(config)

  // WHEN
  await request.post(`${url}/api/automation/get-env`)

  // THEN
  const content = await fs.readFile(filename, 'utf8')
  expect(content).not.toContain('xxx')
})

test('should run a Typescript code with the native Date class', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'getTimestamp',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'get-timestamp',
          output: {
            timestamp: {
              number: '{{runJavascriptCode.timestamp}}',
            },
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            code: String(async function () {
              const timestamp = Date.now()
              return { timestamp }
            }),
          },
        ],
      },
    ],
  }
  const app = new App()
  const url = await app.start(config)

  // WHEN
  const response = await request
    .post(`${url}/api/automation/get-timestamp`)
    .then((res) => res.json())

  // THEN
  expect(response.timestamp).toBeGreaterThan(0)
})

test('should run a Typescript code with the native Array class', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'getIsArray',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'is-array',
          output: {
            isArray: {
              boolean: '{{runJavascriptCode.isArray}}',
            },
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            code: String(async function () {
              const isArray = Array.isArray([1, 2, 3])
              return { isArray }
            }),
          },
        ],
      },
    ],
  }
  const app = new App()
  const url = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/is-array`).then((res) => res.json())

  // THEN
  expect(response.isArray).toBeTruthy()
})

test('should run a Typescript code with the native Number class', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'getIsNumber',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'is-number',
          output: {
            isNumber: {
              boolean: '{{runJavascriptCode.isNumber}}',
            },
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            code: String(async function () {
              const isNumber = Number('1') == 1
              return { isNumber }
            }),
          },
        ],
      },
    ],
  }
  const app = new App()
  const url = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/is-number`).then((res) => res.json())

  // THEN
  expect(response.isNumber).toBeTruthy()
})

test('should run a Typescript code with the native Boolean class', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'getIsBoolean',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'is-boolean',
          output: {
            isBoolean: {
              boolean: '{{runJavascriptCode.isBoolean}}',
            },
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            code: String(async function () {
              const isBoolean = Boolean(1)
              return { isBoolean }
            }),
          },
        ],
      },
    ],
  }
  const app = new App()
  const url = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/is-boolean`).then((res) => res.json())

  // THEN
  expect(response.isBoolean).toBeTruthy()
})

test('should run a Typescript code with the native URLSearchParams class', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'getURLSearchParams',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'get-param',
          output: {
            param: '{{runJavascriptCode.param}}',
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            code: String(async function () {
              const param = new URLSearchParams('a=1').get('a')
              return { param }
            }),
          },
        ],
      },
    ],
  }
  const app = new App()
  const url = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/get-param`).then((res) => res.json())

  // THEN
  expect(response.param).toBe('1')
})
