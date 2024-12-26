import { test, expect } from '@test/fixtures'
import App, { type CodeRunnerContext, type Config } from '@latechforce/engine'
import Database from '@test/drivers/database'

Database.each(test, (dbConfig) => {
  test('should run a Typescript code with a database insert', async ({ request }) => {
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
    const user = await database.table('users').readById(response.user.id)
    expect(response.user.fields.name).toBe('John')
    expect(user?.name).toBe('John')
  })

  test('should run a Typescript code with a database many insert', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
      automations: [
        {
          name: 'createUsers',
          trigger: {
            service: 'Http',
            event: 'ApiCalled',
            path: 'create-users',
            input: {
              type: 'object',
              properties: {
                name: { type: 'string' },
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
                name: '{{trigger.body.name}}',
              },
              code: String(async function (context: CodeRunnerContext<{ name: string }>) {
                const { inputData, services } = context
                const { name } = inputData
                const { database } = services
                const users = await database.table('users').insertMany([{ name }, { name }])
                return { users }
              }),
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)

    // WHEN
    const response = await request
      .post(`${url}/api/automation/create-users`, {
        data: {
          name: 'John',
        },
      })
      .then((res) => res.json())

    // THEN
    expect(response.users).toHaveLength(2)
    expect(response.users[0].fields.name).toBe('John')
    expect(response.users[1].fields.name).toBe('John')
  })

  test('should run a Typescript code with a database update', async ({ request }) => {
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
    const { url } = await app.start(config)
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
    expect(response.user.fields.name).toBe('John Doe')
    expect(user?.name).toBe('John Doe')
  })

  test('should run a Typescript code with a database many update', async ({ request }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
      automations: [
        {
          name: 'updateUsers',
          trigger: {
            service: 'Http',
            event: 'ApiCalled',
            path: 'update-users',
            input: {
              type: 'object',
              properties: {
                name: { type: 'string' },
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
                id: '{{trigger.body.id}}',
                name: '{{trigger.body.name}}',
              },
              code: String(async function (
                context: CodeRunnerContext<{ id: string; name: string }>
              ) {
                const { inputData, services } = context
                const { name } = inputData
                const { database } = services
                const users = await database.table('users').updateMany([
                  { id: '1', fields: { name } },
                  { id: '2', fields: { name } },
                ])
                return { users }
              }),
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
    await database.table('users').insert({ id: '1', name: 'John', created_at: new Date() })
    await database.table('users').insert({ id: '2', name: 'John', created_at: new Date() })

    // WHEN
    const response = await request
      .post(`${url}/api/automation/update-users`, {
        data: {
          name: 'John Doe',
        },
      })
      .then((res) => res.json())

    // THEN
    expect(response.users.length).toBe(2)
    expect(response.users[0].fields.name).toBe('John Doe')
    expect(response.users[1].fields.name).toBe('John Doe')
  })

  test('should run a Typescript code with a database read', async ({ request }) => {
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
                const user = await database.table('users').read({
                  field: 'id',
                  operator: 'Is',
                  value: id,
                })
                return { user: user?.fields }
              }),
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
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

  test('should run a Typescript code with a database read by id', async ({ request }) => {
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
                const user = await database.table('users').readById(id)
                return { user: user?.fields }
              }),
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
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

  test('should run a Typescript code with a database read with a string field', async ({
    request,
  }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
      automations: [
        {
          name: 'readName',
          trigger: {
            service: 'Http',
            event: 'ApiCalled',
            path: 'read-name',
            input: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
            },
            output: {
              name: '{{runJavascriptCode.name}}',
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
                const user = await database.table('users').readById(id)
                return { name: user?.getFieldAsString('name') }
              }),
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
    await database.table('users').insert({ id: '1', name: 'John Doe', created_at: new Date() })

    // WHEN
    const response = await request
      .post(`${url}/api/automation/read-name`, {
        data: {
          id: '1',
        },
      })
      .then((res) => res.json())

    // THEN
    expect(response.name).toBe('John Doe')
  })

  test('should run a Typescript code with a database read with a number field', async ({
    request,
  }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [{ name: 'users', fields: [{ name: 'age', field: 'Number' }] }],
      automations: [
        {
          name: 'readAge',
          trigger: {
            service: 'Http',
            event: 'ApiCalled',
            path: 'read-age',
            input: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
            },
            output: {
              age: {
                number: '{{runJavascriptCode.age}}',
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
                const user = await database.table('users').readById(id)
                return { age: user?.getFieldAsNumber('age') }
              }),
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
    await database
      .table('users', [{ name: 'age', type: 'NUMERIC' }])
      .insert({ id: '1', age: 35, created_at: new Date() })

    // WHEN
    const response = await request
      .post(`${url}/api/automation/read-age`, {
        data: {
          id: '1',
        },
      })
      .then((res) => res.json())

    // THEN
    expect(response.age).toBe(35)
  })

  test('should run a Typescript code with a database read with a boolean field', async ({
    request,
  }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [{ name: 'users', fields: [{ name: 'valid', field: 'Checkbox' }] }],
      automations: [
        {
          name: 'readValid',
          trigger: {
            service: 'Http',
            event: 'ApiCalled',
            path: 'read-valid',
            input: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
            },
            output: {
              valid: {
                boolean: '{{runJavascriptCode.valid}}',
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
                const user = await database.table('users').readById(id)
                return { valid: user?.getFieldAsBoolean('valid') }
              }),
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
    await database
      .table('users', [{ name: 'valid', type: 'BOOLEAN' }])
      .insert({ id: '1', valid: true, created_at: new Date() })

    // WHEN
    const response = await request
      .post(`${url}/api/automation/read-valid`, {
        data: {
          id: '1',
        },
      })
      .then((res) => res.json())

    // THEN
    expect(response.valid).toBeTruthy()
  })

  test('should run a Typescript code with a database read with a Date field', async ({
    request,
  }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [{ name: 'users', fields: [{ name: 'birthdate', field: 'DateTime' }] }],
      automations: [
        {
          name: 'readBirthdate',
          trigger: {
            service: 'Http',
            event: 'ApiCalled',
            path: 'read-birthdate',
            input: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
            },
            output: {
              birthdate: '{{runJavascriptCode.birthdate}}',
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
                const user = await database.table('users').readById(id)
                return { birthdate: user?.getFieldAsDate('birthdate')?.toISOString() }
              }),
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
    const birthdate = new Date()
    await database
      .table('users', [{ name: 'birthdate', type: 'TIMESTAMP' }])
      .insert({ id: '1', birthdate, created_at: new Date() })

    // WHEN
    const response = await request
      .post(`${url}/api/automation/read-birthdate`, {
        data: {
          id: '1',
        },
      })
      .then((res) => res.json())

    // THEN
    expect(response.birthdate).toBe(birthdate.toISOString())
  })

  test('should run a Typescript code with a database list', async ({ request }) => {
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
                return { users: users.map((user) => user.fields) }
              }),
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
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

  test('should run a Typescript code with a database list with is filter', async ({ request }) => {
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
                return { users: users.map((user) => user.fields) }
              }),
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
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

  test('should run a Typescript code with a database list with isAnyOf filter', async ({
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
                return { users: users.map((user) => user.fields) }
              }),
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
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
