import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'
import Storage from '@tests/storage'
import fs from 'fs-extra'
import mammoth from 'mammoth'

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

    test('should get a docx file from a bucket', async ({ request }) => {
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
      const url = await app.start(config)
      await storage.bucket('invoices').save({
        id: '1',
        name: 'invoice-1.docx',
        file_data: fs.readFileSync('./tests/__helpers__/docs/template.docx'),
        created_at: new Date(),
      })

      // WHEN
      const file = await request.get(url + '/api/bucket/invoices/1').then((res) => res.body())

      // THEN
      const { value } = await mammoth.extractRawText({ buffer: file })
      expect(value).toContain('Hello')
    })
  })
})
