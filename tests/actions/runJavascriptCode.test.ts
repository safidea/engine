import { test, expect, js } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'

test.describe('Run javascript code action', () => {
  test('should run a javascript code', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'addNumbers',
          trigger: {
            trigger: 'ApiCalled',
            path: 'add-numbers',
            input: {
              numberOne: { type: 'number' },
              numberTwo: { type: 'number' },
            },
            output: {
              sum: {
                value: '{{runJavascriptCode.result}}',
                type: 'number',
              },
            },
          },
          actions: [
            {
              action: 'RunJavascriptCode',
              name: 'runJavascriptCode',
              input: {
                numberOne: {
                  value: '{{trigger.body.numberOne}}',
                  type: 'number',
                },
                numberTwo: {
                  value: '{{trigger.body.numberTwo}}',
                  type: 'number',
                },
              },
              code: js`
                  const { numberOne, numberTwo } = inputData
                  return { result: numberOne + numberTwo }
                `,
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const { response } = await request
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

  Database.each(test, (dbConfig) => {
    test('should run a javascript code with a database insert', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
        tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
        automations: [
          {
            name: 'createUser',
            trigger: {
              trigger: 'ApiCalled',
              path: 'create-user',
              input: {
                name: { type: 'string' },
              },
              output: {
                user: {
                  value: '{{runJavascriptCode.user}}',
                  type: 'object',
                },
              },
            },
            actions: [
              {
                action: 'RunJavascriptCode',
                name: 'runJavascriptCode',
                input: {
                  name: {
                    value: '{{trigger.body.name}}',
                    type: 'string',
                  },
                },
                code: js`
                  const { name } = inputData
                  const user = await table('users').insert({ name })
                  return { user }
                `,
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const { response } = await request
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

    test('should run a javascript code with a database update', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
        tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
        automations: [
          {
            name: 'updateUser',
            trigger: {
              trigger: 'ApiCalled',
              path: 'update-user',
              input: {
                id: { type: 'string' },
                name: { type: 'string' },
              },
              output: {
                user: {
                  value: '{{runJavascriptCode.user}}',
                  type: 'object',
                },
              },
            },
            actions: [
              {
                action: 'RunJavascriptCode',
                name: 'runJavascriptCode',
                input: {
                  id: {
                    value: '{{trigger.body.id}}',
                    type: 'string',
                  },
                  name: {
                    value: '{{trigger.body.name}}',
                    type: 'string',
                  },
                },
                code: js`
                  const { name, id } = inputData
                  const user = await table('users').update(id, { name })
                  return { user }
                `,
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
      const { response } = await request
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

    test('should run a javascript code with a database read', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
        tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
        automations: [
          {
            name: 'readUser',
            trigger: {
              trigger: 'ApiCalled',
              path: 'read-user',
              input: {
                id: { type: 'string' },
              },
              output: {
                user: {
                  value: '{{runJavascriptCode.user}}',
                  type: 'object',
                },
              },
            },
            actions: [
              {
                action: 'RunJavascriptCode',
                name: 'runJavascriptCode',
                input: {
                  id: {
                    value: '{{trigger.body.id}}',
                    type: 'string',
                  },
                },
                code: js`
                  const { id } = inputData
                  const user = await table('users').read(id)
                  return { user }
                `,
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
      const { response } = await request
        .post(`${url}/api/automation/read-user`, {
          data: {
            id: '1',
          },
        })
        .then((res) => res.json())

      // THEN
      expect(response.user.name).toBe('John Doe')
    })

    test('should run a javascript code with a database list', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
        tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
        automations: [
          {
            name: 'listUsers',
            trigger: {
              trigger: 'ApiCalled',
              path: 'list-users',
              output: {
                users: {
                  value: '{{runJavascriptCode.users}}',
                  type: 'array',
                },
              },
            },
            actions: [
              {
                action: 'RunJavascriptCode',
                name: 'runJavascriptCode',
                code: js`
                  const { id } = inputData
                  const users = await table('users').list()
                  return { users }
                `,
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
      const { response } = await request
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

    test('should run a javascript code with a database list with filters', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
        tables: [{ name: 'users', fields: [{ name: 'name', field: 'SingleLineText' }] }],
        automations: [
          {
            name: 'listUsers',
            trigger: {
              trigger: 'ApiCalled',
              path: 'list-users',
              output: {
                users: {
                  value: '{{runJavascriptCode.users}}',
                  type: 'array',
                },
              },
            },
            actions: [
              {
                action: 'RunJavascriptCode',
                name: 'runJavascriptCode',
                code: js`
                  const users = await table('users').list([{ field: 'id', operator: 'is', value: '2' }])
                  return { users }
                `,
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
      const { response } = await request
        .post(`${url}/api/automation/list-users`, {
          data: {
            id: '1',
          },
        })
        .then((res) => res.json())

      // THEN
      expect(response.users).toHaveLength(1)
      expect(response.users[0].name).toBe('John Wick')
    })
  })
})
