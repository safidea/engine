import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'

test.describe('Database', async () => {
  test.slow()

  test('should throw an error if database type is not valid', async () => {
    // GIVEN
    const config: Config = {
      name: 'Database',
      tables: [
        {
          name: 'users',
          fields: [
            {
              name: 'email',
              field: 'SingleLineText',
            },
            {
              name: 'password',
              field: 'SingleLineText',
            },
          ],
        },
      ],
      database: {
        url: 'https://example.com',
        type: 'invalid',
      },
    }
    const app = new App()

    // WHEN
    const call = async () => app.start(config)

    // THEN
    await expect(call()).rejects.toThrow('DatabaseDriver: database "invalid" not supported')
  })

  Database.each(test, (dbConfig) => {
    test('should start with a new table', async () => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'Database',
        tables: [
          {
            name: 'users',
            fields: [
              {
                name: 'email',
                field: 'SingleLineText',
              },
              {
                name: 'password',
                field: 'SingleLineText',
              },
            ],
          },
        ],
        database: dbConfig,
      }

      // WHEN
      const app = new App()
      await app.start(config)

      // THEN
      await expect(database.table('users').exists()).resolves.toBe(true)
    })

    test('should start with an existing table', async () => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'Database',
        tables: [
          {
            name: 'users',
            fields: [
              {
                name: 'email',
                field: 'SingleLineText',
              },
              {
                name: 'password',
                field: 'SingleLineText',
              },
            ],
          },
        ],
        database: dbConfig,
      }
      await database.table('users').create([
        {
          name: 'email',
          type: 'text',
        },
      ])

      // WHEN
      const app = new App()
      await app.start(config)

      // THEN
      await expect(database.table('users').fieldExists('password')).resolves.toBe(true)
    })

    test(`should start with a ${dbConfig.type} database`, async () => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'Database',
        tables: [
          {
            name: 'users',
            fields: [
              {
                name: 'email',
                field: 'SingleLineText',
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()

      // WHEN
      const call = () => app.start(config)

      // THEN
      await expect(call()).resolves.not.toThrow()
      await expect(database.table('users').fieldExists('email')).resolves.toBe(true)
    })
  })
})
