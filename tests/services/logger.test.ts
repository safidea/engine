import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'

test.describe('Logger', () => {
  Database.each(test, (dbConfig) => {
    test.skip('should create _logs table', async () => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'Logs',
        database: dbConfig,
        logger: {
          store: true,
        },
      }

      // WHEN
      const app = new App()
      await app.start(config)

      // THEN
      await expect(database.table('_logs').exists()).resolves.toBe(true)
    })
  })
})
