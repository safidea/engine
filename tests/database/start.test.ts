import { test, expect } from '@utils/tests/fixtures'
import App, { type Config } from '@solumy/engine'
import Database from '@utils/tests/database'

test.describe('Database start', () => {
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
})
