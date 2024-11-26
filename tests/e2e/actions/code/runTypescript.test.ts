import { test, expect, env } from '@tests/fixtures'
import App, { type CodeRunnerContext, type Config } from '@latechforce/engine'
import Database from '@tests/drivers/database'
import { nanoid } from 'nanoid'
import fs from 'fs-extra'
import { join } from 'path'
import { integration } from '@tests/integrations/notion'

test.describe('Run TypeScript code action', () => {
  test('should run a TypeScript code', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'addNumbers',
          trigger: {
            service: 'Http',
            event: 'ApiCalled',
            path: 'add-numbers',
            input: {
              type: 'object',
              properties: {
                numberOne: { type: 'number' },
                numberTwo: { type: 'number' },
              },
            },
            output: {
              sum: {
                number: '{{runTypescriptCode.result}}',
              },
            },
          },
          actions: [
            {
              service: 'Code',
              action: 'RunTypescript',
              name: 'runTypescriptCode',
              input: {
                numberOne: {
                  number: '{{trigger.body.numberOne}}',
                },
                numberTwo: {
                  number: '{{trigger.body.numberTwo}}',
                },
              },
              code: String(async function (
                context: CodeRunnerContext<{ numberOne: number; numberTwo: number }>
              ) {
                const { inputData } = context
                const { numberOne, numberTwo } = inputData
                return { result: numberOne + numberTwo }
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
      .post(`${url}/api/automation/add-numbers`, {
        data: {
          numberOne: 1,
          numberTwo: 2,
        },
      })
      .then((res) => res.json())

    // THEN
    expect(response.sum).toBe(3)
  })

  test('should run a JavaScript code with env variable', async ({ request }) => {
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

  test('should run a JavaScript code with env variable and not showing them in logs', async ({
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

  test.describe('with native classes', () => {
    test('should run a JavaScript code with the native Date class', async ({ request }) => {
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

    test('should run a JavaScript code with the native Array class', async ({ request }) => {
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
      const response = await request
        .post(`${url}/api/automation/is-array`)
        .then((res) => res.json())

      // THEN
      expect(response.isArray).toBeTruthy()
    })

    test('should run a JavaScript code with the native Number class', async ({ request }) => {
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
      const response = await request
        .post(`${url}/api/automation/is-number`)
        .then((res) => res.json())

      // THEN
      expect(response.isNumber).toBeTruthy()
    })

    test('should run a JavaScript code with the native Boolean class', async ({ request }) => {
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
      const response = await request
        .post(`${url}/api/automation/is-boolean`)
        .then((res) => res.json())

      // THEN
      expect(response.isBoolean).toBeTruthy()
    })

    test('should run a JavaScript code with the native URLSearchParams class', async ({
      request,
    }) => {
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
      const response = await request
        .post(`${url}/api/automation/get-param`)
        .then((res) => res.json())

      // THEN
      expect(response.param).toBe('1')
    })
  })

  test.describe('with packages', () => {
    test('should run a JavaScript code with the date-fns package', async ({ request }) => {
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
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const response = await request
        .post(`${url}/api/automation/get-date`)
        .then((res) => res.json())

      // THEN
      expect(response.date).toBe('2024-09-01')
    })

    test('should run a JavaScript code with xml2js package', async ({ request }) => {
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
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const response = await request
        .post(`${url}/api/automation/parse-xml`)
        .then((res) => res.json())

      // THEN
      expect(response.result).toStrictEqual({
        key: 'value',
        root: { item: ['Value1', 'Value2'] },
      })
    })

    test('should run a JavaScript code with axios package', async ({ request }) => {
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
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const response = await request.post(`${url}/api/automation/axios`).then((res) => res.json())

      // THEN
      expect(response.exist).toBeTruthy()
    })

    test('should run a JavaScript code with https package', async ({ request }) => {
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
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const response = await request.post(`${url}/api/automation/https`).then((res) => res.json())

      // THEN
      expect(response.exist).toBeTruthy()
    })

    test('should run a JavaScript code with crypto package', async ({ request }) => {
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
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const response = await request.post(`${url}/api/automation/crypto`).then((res) => res.json())

      // THEN
      expect(response.exist).toBeTruthy()
    })
  })

  test.describe('with database service', () => {
    Database.each(test, (dbConfig) => {
      test('should run a JavaScript code with a database insert', async ({ request }) => {
        // GIVEN
        const database = new Database(dbConfig)
        const config: Config = {
          name: 'App',
          tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
          automations: [
            {
              name: 'createUser',
              trigger: {
                service: 'Http',
                event: 'ApiCalled',
                path: 'create-user',
                input: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                  },
                },
                output: {
                  user: {
                    json: '{{runJavascriptCode.user}}',
                  },
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
                    const { inputData, services } = context
                    const { name } = inputData
                    const { database } = services
                    const user = await database.table('users').insert({ name })
                    return { user }
                  }),
                },
              ],
            },
          ],
          database: dbConfig,
        }
        const app = new App()
        const url = await app.start(config)

        // WHEN
        const response = await request
          .post(`${url}/api/automation/create-user`, {
            data: {
              name: 'John',
            },
          })
          .then((res) => res.json())

        // THEN
        const user = await database.table('users').readById(response.user.id)
        expect(response.user.name).toBe('John')
        expect(user?.name).toBe('John')
      })

      test('should run a JavaScript code with a database update', async ({ request }) => {
        // GIVEN
        const database = new Database(dbConfig)
        const config: Config = {
          name: 'App',
          tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
          automations: [
            {
              name: 'updateUser',
              trigger: {
                service: 'Http',
                event: 'ApiCalled',
                path: 'update-user',
                input: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                  },
                },
                output: {
                  user: {
                    json: '{{runJavascriptCode.user}}',
                  },
                },
              },
              actions: [
                {
                  service: 'Code',
                  action: 'RunTypescript',
                  name: 'runJavascriptCode',
                  input: {
                    id: '{{trigger.body.id}}',
                    name: '{{trigger.body.name}}',
                  },
                  code: String(async function (
                    context: CodeRunnerContext<{ id: string; name: string }>
                  ) {
                    const { inputData, services } = context
                    const { name, id } = inputData
                    const { database } = services
                    const user = await database.table('users').update(id, { name })
                    return { user }
                  }),
                },
              ],
            },
          ],
          database: dbConfig,
        }
        const app = new App()
        const url = await app.start(config)
        await database.table('users').insert({ id: '1', name: 'John', created_at: new Date() })

        // WHEN
        const response = await request
          .post(`${url}/api/automation/update-user`, {
            data: {
              id: '1',
              name: 'John Doe',
            },
          })
          .then((res) => res.json())

        // THEN
        const user = await database.table('users').readById(response.user.id)
        expect(response.user.name).toBe('John Doe')
        expect(user?.name).toBe('John Doe')
      })

      test('should run a JavaScript code with a database read', async ({ request }) => {
        // GIVEN
        const database = new Database(dbConfig)
        const config: Config = {
          name: 'App',
          tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
          automations: [
            {
              name: 'readUser',
              trigger: {
                service: 'Http',
                event: 'ApiCalled',
                path: 'read-user',
                input: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                  },
                },
                output: {
                  user: {
                    json: '{{runJavascriptCode.user}}',
                  },
                },
              },
              actions: [
                {
                  service: 'Code',
                  action: 'RunTypescript',
                  name: 'runJavascriptCode',
                  input: {
                    id: '{{trigger.body.id}}',
                  },
                  code: String(async function (context: CodeRunnerContext<{ id: string }>) {
                    const { inputData, services } = context
                    const { database } = services
                    const { id } = inputData
                    const user = await database.table('users').read(id)
                    return { user }
                  }),
                },
              ],
            },
          ],
          database: dbConfig,
        }
        const app = new App()
        const url = await app.start(config)
        await database.table('users').insert({ id: '1', name: 'John Doe', created_at: new Date() })

        // WHEN
        const response = await request
          .post(`${url}/api/automation/read-user`, {
            data: {
              id: '1',
            },
          })
          .then((res) => res.json())

        // THEN
        expect(response.user.name).toBe('John Doe')
      })

      test('should run a JavaScript code with a database list', async ({ request }) => {
        // GIVEN
        const database = new Database(dbConfig)
        const config: Config = {
          name: 'App',
          tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
          automations: [
            {
              name: 'listUsers',
              trigger: {
                service: 'Http',
                event: 'ApiCalled',
                path: 'list-users',
                output: {
                  users: {
                    json: '{{runJavascriptCode.users}}',
                  },
                },
              },
              actions: [
                {
                  service: 'Code',
                  action: 'RunTypescript',
                  name: 'runJavascriptCode',
                  code: String(async function (context: CodeRunnerContext) {
                    const { database } = context.services
                    const users = await database.table('users').list()
                    return { users }
                  }),
                },
              ],
            },
          ],
          database: dbConfig,
        }
        const app = new App()
        const url = await app.start(config)
        await database.table('users').insertMany([
          { id: '1', name: 'John Doe', created_at: new Date() },
          { id: '2', name: 'John Wick', created_at: new Date() },
          { id: '3', name: 'John Connor', created_at: new Date() },
        ])

        // WHEN
        const response = await request
          .post(`${url}/api/automation/list-users`, {
            data: {
              id: '1',
            },
          })
          .then((res) => res.json())

        // THEN
        expect(response.users).toHaveLength(3)
        expect(response.users[0].name).toBe('John Doe')
        expect(response.users[1].name).toBe('John Wick')
        expect(response.users[2].name).toBe('John Connor')
      })

      test('should run a JavaScript code with a database list with is filter', async ({
        request,
      }) => {
        // GIVEN
        const database = new Database(dbConfig)
        const config: Config = {
          name: 'App',
          tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
          automations: [
            {
              name: 'listUsers',
              trigger: {
                service: 'Http',
                event: 'ApiCalled',
                path: 'list-users',
                output: {
                  users: {
                    json: '{{runJavascriptCode.users}}',
                  },
                },
              },
              actions: [
                {
                  service: 'Code',
                  action: 'RunTypescript',
                  name: 'runJavascriptCode',
                  code: String(async function (context: CodeRunnerContext) {
                    const { database } = context.services
                    const users = await database.table('users').list({
                      field: 'id',
                      operator: 'Is',
                      value: '2',
                    })
                    return { users }
                  }),
                },
              ],
            },
          ],
          database: dbConfig,
        }
        const app = new App()
        const url = await app.start(config)
        await database.table('users').insertMany([
          { id: '1', name: 'John Doe', created_at: new Date() },
          { id: '2', name: 'John Wick', created_at: new Date() },
          { id: '3', name: 'John Connor', created_at: new Date() },
        ])

        // WHEN
        const response = await request
          .post(`${url}/api/automation/list-users`)
          .then((res) => res.json())

        // THEN
        expect(response.users).toHaveLength(1)
        expect(response.users[0].name).toBe('John Wick')
      })

      test('should run a JavaScript code with a database list with isAnyOf filter', async ({
        request,
      }) => {
        // GIVEN
        const database = new Database(dbConfig)
        const config: Config = {
          name: 'App',
          tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
          automations: [
            {
              name: 'listUsers',
              trigger: {
                service: 'Http',
                event: 'ApiCalled',
                path: 'list-users',
                output: {
                  users: {
                    json: '{{runJavascriptCode.users}}',
                  },
                },
              },
              actions: [
                {
                  service: 'Code',
                  action: 'RunTypescript',
                  name: 'runJavascriptCode',
                  code: String(async function (context: CodeRunnerContext) {
                    const { database } = context.services
                    const users = await database.table('users').list({
                      field: 'id',
                      operator: 'IsAnyOf',
                      value: ['3', '2'],
                    })
                    return { users }
                  }),
                },
              ],
            },
          ],
          database: dbConfig,
        }
        const app = new App()
        const url = await app.start(config)
        await database.table('users').insertMany([
          { id: '1', name: 'John Doe', created_at: new Date() },
          { id: '2', name: 'John Wick', created_at: new Date() },
          { id: '3', name: 'John Connor', created_at: new Date() },
        ])

        // WHEN
        const response = await request
          .post(`${url}/api/automation/list-users`)
          .then((res) => res.json())

        // THEN
        expect(response.users).toHaveLength(2)
        expect(response.users[0].name).toBe('John Wick')
        expect(response.users[1].name).toBe('John Connor')
      })
    })
  })

  test.describe('with Notion integration', () => {
    test('should run a JavaScript code with a Notion database page create', async ({ request }) => {
      // GIVEN
      const config: Config = {
        name: 'App',
        automations: [
          {
            name: 'createUser',
            trigger: {
              service: 'Http',
              event: 'ApiCalled',
              path: 'create-user',
              input: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                },
              },
              output: {
                user: {
                  json: '{{runJavascriptCode.user}}',
                },
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
                env: {
                  TEST_NOTION_TABLE_ID: env.TEST_NOTION_TABLE_ID,
                },
                code: String(async function (context: CodeRunnerContext<{ name: string }>) {
                  const { inputData, integrations, env } = context
                  const { name } = inputData
                  const { notion } = integrations
                  const table = await notion.table(env.TEST_NOTION_TABLE_ID)
                  const user = await table.create({ name })
                  return { user }
                }),
              },
            ],
          },
        ],
        integrations: {
          notion: {
            token: env.TEST_NOTION_TOKEN,
            pollingInterval: 10,
          },
        },
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const response = await request
        .post(`${url}/api/automation/create-user`, {
          data: {
            name: 'John',
          },
        })
        .then((res) => res.json())

      // THEN
      const table = await integration.table(env.TEST_NOTION_TABLE_ID)
      const user = await table.retrieve(response.user.id)
      expect(response.user.properties.name).toBe('John')
      expect(user.properties.name).toBe('John')
    })
  })
})
