import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'
import Storage from '@tests/storage'

test.describe('App with buckets', () => {
  Database.each(test, (dbConfig) => {
    test('should start an app with a bucket', async () => {
      // GIVEN
      const database = new Database(dbConfig)
      const storage = new Storage(database)
      const config: Config = {
        name: 'Database',
        buckets: [
          {
            name: 'invoices',
          },
        ],
        database: dbConfig,
      }
      const app = new App()

      // WHEN
      await app.start(config)

      // THEN
      await expect(storage.bucket('invoices').exists()).resolves.toBe(true)
    })
  })
})
