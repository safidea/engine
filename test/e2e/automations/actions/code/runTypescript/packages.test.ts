import { test, expect, NodeApp } from '@test/fixtures'
import App, { type CodeRunnerContext, type Config } from '@latechforce/engine'

test('should run a Typescript code with the date-fns package', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'getDate',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'get-date',
          output: {
            date: '{{runJavascriptCode.date}}',
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            code: String(async function (context: CodeRunnerContext) {
              const {
                packages: { dateFns },
              } = context
              const date = dateFns.format(new Date(2024, 8, 1), 'yyyy-MM-dd')
              return { date }
            }),
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/get-date`).then((res) => res.json())

  // THEN
  expect(response.date).toBe('2024-09-01')
})

test('should run a Typescript code with xml2js package', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'parseXml',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'parse-xml',
          output: {
            result: {
              json: '{{runJavascriptCode.result}}',
            },
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            code: String(async function (context: CodeRunnerContext) {
              const {
                packages: { xml2js },
              } = context
              const parser = new xml2js.Parser({
                trim: true,
                explicitArray: false,
              })
              const xml =
                '<result><root><item>Value1</item><item>Value2</item></root><key> value </key></result>'
              const { result } = await parser.parseStringPromise(xml)
              return { result }
            }),
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/parse-xml`).then((res) => res.json())

  // THEN
  expect(response.result).toStrictEqual({
    key: 'value',
    root: { item: ['Value1', 'Value2'] },
  })
})

test('should run a Typescript code with axios package', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'axios',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'axios',
          output: {
            exist: {
              boolean: '{{runJavascriptCode.exist}}',
            },
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            code: String(async function (context: CodeRunnerContext) {
              const {
                packages: { axios },
              } = context
              return { exist: !!axios?.post }
            }),
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/axios`).then((res) => res.json())

  // THEN
  expect(response.exist).toBeTruthy()
})

test('should run a Typescript code with https package', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'https',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'https',
          output: {
            exist: {
              boolean: '{{runJavascriptCode.exist}}',
            },
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            code: String(async function (context: CodeRunnerContext) {
              const {
                packages: { https },
              } = context
              return { exist: !!https?.globalAgent }
            }),
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/https`).then((res) => res.json())

  // THEN
  expect(response.exist).toBeTruthy()
})

test('should run a Typescript code with crypto package', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'crypto',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'crypto',
          output: {
            exist: {
              boolean: '{{runJavascriptCode.exist}}',
            },
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            code: String(async function (context: CodeRunnerContext) {
              const {
                packages: { crypto },
              } = context
              return { exist: !!crypto?.constants }
            }),
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/crypto`).then((res) => res.json())

  // THEN
  expect(response.exist).toBeTruthy()
})

test('should run a Typescript code with lodash package', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'lodash',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'lodash',
          output: {
            exist: {
              boolean: '{{runJavascriptCode.exist}}',
            },
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunTypescript',
            name: 'runJavascriptCode',
            code: String(async function (context: CodeRunnerContext) {
              const {
                packages: { lodash },
              } = context
              return { exist: !!lodash?.chunk }
            }),
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const response = await request.post(`${url}/api/automation/lodash`).then((res) => res.json())

  // THEN
  expect(response.exist).toBeTruthy()
})
