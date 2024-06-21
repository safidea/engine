import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'
import { PostgreSqlContainer } from '@testcontainers/postgresql'

test.describe('Database', () => {
  test('should start with a new table', async () => {
    // GIVEN
    const database = new Database()
    const config: Config = {
      name: 'Database',
      features: [
        {
          name: 'start',
          tables: [
            {
              name: 'users',
              fields: [
                {
                  name: 'email',
                  type: 'SingleLineText',
                },
                {
                  name: 'password',
                  type: 'SingleLineText',
                },
              ],
            },
          ],
        },
      ],
      database: database.config,
    }

    // WHEN
    const app = new App()
    await app.start(config)

    // THEN
    await expect(database.table('users').exists()).resolves.toBe(true)
  })

  test('should start with an existing table', async () => {
    // GIVEN
    const database = new Database()
    const config: Config = {
      name: 'Database',
      features: [
        {
          name: 'start',
          tables: [
            {
              name: 'users',
              fields: [
                {
                  name: 'email',
                  type: 'SingleLineText',
                },
                {
                  name: 'password',
                  type: 'SingleLineText',
                },
              ],
            },
          ],
        },
      ],
      database: database.config,
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

  test('should start with a postgres database', async () => {
    // GIVEN
    const postgresContainer = await new PostgreSqlContainer().start()
    const database = new Database('postgres', postgresContainer.getConnectionUri())
    const config: Config = {
      name: 'Database',
      features: [
        {
          name: 'start',
          tables: [
            {
              name: 'users',
              fields: [
                {
                  name: 'email',
                  type: 'SingleLineText',
                },
              ],
            },
          ],
        },
      ],
      database: database.config,
    }

    // WHEN
    const app = new App()

    // THEN
    await expect(app.start(config)).resolves.not.toThrow()
    await expect(database.table('users').fieldExists('email')).resolves.toBe(true)
  })
})
