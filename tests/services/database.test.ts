import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

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
})
