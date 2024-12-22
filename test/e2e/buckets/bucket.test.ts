import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'
import Database from '@test/drivers/database'
import Storage from '@test/drivers/storage'
import SpreadsheetLoader from '@test/drivers/spreadsheetLoader'
import fs from 'fs-extra'
import mammoth from 'mammoth'

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

  test('should get a .docx file from a bucket', async ({ request }) => {
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
    const { url } = await app.start(config)
    await storage.bucket('invoices').save({
      id: '1',
      name: 'invoice-1.docx',
      data: fs.readFileSync('./test/__helpers__/docs/template.docx'),
      created_at: new Date(),
    })

    // WHEN
    const file = await request.get(url + '/api/bucket/invoices/1').then((res) => res.body())

    // THEN
    const { value } = await mammoth.extractRawText({ buffer: file })
    expect(value).toContain('Hello')
  })

  test('should get a .xlsx file from a bucket', async ({ request }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const storage = new Storage(database)
    const spreadsheetLoader = new SpreadsheetLoader()
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
    const { url } = await app.start(config)
    await storage.bucket('invoices').save({
      id: '1',
      name: 'invoice-1.xlsx',
      data: fs.readFileSync('./test/__helpers__/docs/template.xlsx'),
      created_at: new Date(),
    })

    // WHEN
    const file = await request.get(url + '/api/bucket/invoices/1').then((res) => res.body())

    // THEN
    const workbook = await spreadsheetLoader.fromXlsxBuffer(file)
    const cell = workbook.readTextCells().find(({ value }) => value.includes('Hello'))
    expect(cell).toBeDefined()
  })
})
