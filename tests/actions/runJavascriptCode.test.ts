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
  })
})
