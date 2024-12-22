import { test, expect, env } from '@test/fixtures'
import App, { type CodeRunnerContext, type Config } from '@latechforce/engine'
import { integration as notion } from '@test/integrations/notion'

const { TEST_NOTION_TABLE_1_ID, TEST_NOTION_TOKEN, TEST_NOTION_TABLE_FILES_ID } = env

test.slow()

test('should run a Typescript code with a Notion database page create', async ({ request }) => {
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
              TEST_NOTION_TABLE_1_ID,
            },
            code: String(async function (context: CodeRunnerContext<{ name: string }>) {
              const { inputData, integrations, env } = context
              const { name } = inputData
              const { notion } = integrations
              const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
              const user = await table.create({ name })
              return { user }
            }),
          },
        ],
      },
    ],
    integrations: {
      notion: {
        token: TEST_NOTION_TOKEN,
      },
    },
  }
  const app = new App()
  const { url } = await app.start(config)

  // WHEN
  const response = await request
    .post(`${url}/api/automation/create-user`, {
      data: {
        name: 'John',
      },
    })
    .then((res) => res.json())

  // THEN
  const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
  const user = await table.retrieve(response.user.id)
  expect(response.user.properties.name).toBe('John')
  expect(user.properties.name).toBe('John')
})

test('should run a Typescript code with a Notion database page update', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
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
            env: {
              TEST_NOTION_TABLE_1_ID,
            },
            code: String(async function (context: CodeRunnerContext<{ id: string; name: string }>) {
              const { inputData, integrations, env } = context
              const { name, id } = inputData
              const { notion } = integrations
              const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
              const user = await table.update(id, { name })
              return { user }
            }),
          },
        ],
      },
    ],
    integrations: {
      notion: {
        token: TEST_NOTION_TOKEN,
      },
    },
  }
  const app = new App()
  const { url } = await app.start(config)
  const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
  const { id } = await table.create({ name: 'John' })

  // WHEN
  const response = await request
    .post(`${url}/api/automation/update-user`, {
      data: {
        id,
        name: 'John Doe',
      },
    })
    .then((res) => res.json())

  // THEN
  const user = await table.retrieve(response.user.id)
  expect(response.user.properties.name).toBe('John Doe')
  expect(user.properties.name).toBe('John Doe')
})

test('should run a Typescript code with a Notion database page update and a notion uploaded file', async ({
  request,
}) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'updateFile',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'update-file',
          input: {
            type: 'object',
            properties: {
              id: { type: 'string' },
            },
          },
          output: {
            file: {
              json: '{{runJavascriptCode.file}}',
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
            env: {
              TEST_NOTION_TABLE_1_ID,
              TEST_NOTION_TABLE_FILES_ID,
            },
            code: String(async function (context: CodeRunnerContext<{ id: string; name: string }>) {
              const { inputData, integrations, env } = context
              const { id } = inputData
              const { notion } = integrations
              const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
              const tableFiles = await notion.getTable(env.TEST_NOTION_TABLE_FILES_ID)
              const [pageFile] = await tableFiles.list()
              const files = pageFile.properties.files
              const file = await table.update(id, { files })
              return { file }
            }),
          },
        ],
      },
    ],
    integrations: {
      notion: {
        token: TEST_NOTION_TOKEN,
      },
    },
  }
  const app = new App()
  const { url } = await app.start(config)
  const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
  const { id } = await table.create({ files: [] })

  // WHEN
  const response = await request
    .post(`${url}/api/automation/update-file`, {
      data: {
        id,
      },
    })
    .then((res) => res.json())

  // THEN
  const file = await table.retrieve(response.file.id)
  expect(response.file.properties.files).toHaveLength(1)
  expect(file.properties.files).toHaveLength(1)
})

test('should run a Typescript code with a Notion database page retrieve', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
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
            env: {
              TEST_NOTION_TABLE_1_ID,
            },
            code: String(async function (context: CodeRunnerContext<{ id: string }>) {
              const { inputData, integrations, env } = context
              const { notion } = integrations
              const { id } = inputData
              const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
              const user = await table.retrieve(id)
              return { user }
            }),
          },
        ],
      },
    ],
    integrations: {
      notion: {
        token: TEST_NOTION_TOKEN,
      },
    },
  }
  const app = new App()
  const { url } = await app.start(config)
  const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
  const { id } = await table.create({ name: 'John Doe' })

  // WHEN
  const response = await request
    .post(`${url}/api/automation/read-user`, {
      data: {
        id,
      },
    })
    .then((res) => res.json())

  // THEN
  expect(response.user.properties.name).toBe('John Doe')
})

test('should run a Typescript code with a Notion database page archive', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
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
            env: {
              TEST_NOTION_TABLE_1_ID,
            },
            code: String(async function (context: CodeRunnerContext<{ id: string }>) {
              const { inputData, integrations, env } = context
              const { notion } = integrations
              const { id } = inputData
              const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
              await table.archive(id)
              const user = await table.retrieve(id)
              return { user }
            }),
          },
        ],
      },
    ],
    integrations: {
      notion: {
        token: TEST_NOTION_TOKEN,
      },
    },
  }
  const app = new App()
  const { url } = await app.start(config)
  const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
  const { id } = await table.create({ name: 'John Doe' })

  // WHEN
  const response = await request
    .post(`${url}/api/automation/read-user`, {
      data: {
        id,
      },
    })
    .then((res) => res.json())

  // THEN
  expect(response.user.archived).toBeTruthy()
})

test('should run a Typescript code with a Notion database page list', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'listUsers',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'list-users',
          input: {
            type: 'object',
            properties: {
              ids: { type: 'array', items: { type: 'string' } },
            },
          },
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
            input: {
              ids: {
                json: '{{trigger.body.ids}}',
              },
            },
            env: {
              TEST_NOTION_TABLE_1_ID,
            },
            code: String(async function (context: CodeRunnerContext<{ ids: string[] }>) {
              const { notion } = context.integrations
              const { ids } = context.inputData
              const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
              const users = await table.list({
                or: ids.map((id) => ({
                  field: 'id',
                  operator: 'Is',
                  value: id.replace(/-/g, ''),
                })),
              })
              return { users }
            }),
          },
        ],
      },
    ],
    integrations: {
      notion: {
        token: TEST_NOTION_TOKEN,
      },
    },
  }
  const app = new App()
  const { url } = await app.start(config)
  const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
  const users = await table.createMany([
    { name: 'John Doe' },
    { name: 'John Wick' },
    { name: 'John Connor' },
  ])

  // WHEN
  const response = await request
    .post(`${url}/api/automation/list-users`, {
      data: { ids: users.map((user) => user.id) },
    })
    .then((res) => res.json())

  // THEN
  expect(response.users).toHaveLength(3)
  const names = response.users.map((user: { properties: { name: string } }) => user.properties.name)
  expect(names).toContain('John Doe')
  expect(names).toContain('John Wick')
  expect(names).toContain('John Connor')
})

test('should run a Typescript code with a Notion database page and a title property', async ({
  request,
}) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'readProperty',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'read-property',
          input: {
            type: 'object',
            properties: {
              id: { type: 'string' },
            },
          },
          output: {
            property: '{{runJavascriptCode.property}}',
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
            env: {
              TEST_NOTION_TABLE_1_ID,
            },
            code: String(async function (context: CodeRunnerContext<{ id: string }>) {
              const { inputData, integrations, env } = context
              const { notion } = integrations
              const { id } = inputData
              const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
              const page = await table.retrieve(id)
              if (!page) throw new Error('Page not found')
              const property: string | null = page.getTitle('name')
              return { property }
            }),
          },
        ],
      },
    ],
    integrations: {
      notion: {
        token: TEST_NOTION_TOKEN,
      },
    },
  }
  const app = new App()
  const { url } = await app.start(config)
  const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
  const { id } = await table.create({ name: 'John Doe' })

  // WHEN
  const response = await request
    .post(`${url}/api/automation/read-property`, {
      data: {
        id,
      },
    })
    .then((res) => res.json())

  // THEN
  expect(response.property).toBe('John Doe')
})
