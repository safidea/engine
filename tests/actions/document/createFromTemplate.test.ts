import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Storage from '@tests/storage'
import Database from '@tests/database'

test.describe('Create document from template action', () => {
  Database.each(test, (dbConfig) => {
    test('should create a document from a .docx file', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const storage = new Storage(database)
      const config: Config = {
        name: 'App',
        automations: [
          {
            name: 'createDocument',
            trigger: {
              trigger: 'ApiCalled',
              path: 'create-document',
              output: {
                fileId: {
                  value: '{{createDocument.fileId}}',
                  type: 'string',
                },
              },
            },
            actions: [
              {
                service: 'Document',
                action: 'CreateFromTemplate',
                name: 'createDocument',
                input: {
                  name: {
                    value: 'John Doe',
                    type: 'string',
                  },
                },
                templatePath: './tests/__helpers__/docs/template.docx',
                fileName: 'output.docx',
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
        .post(`${url}/api/automation/create-document`)
        .then((res) => res.json())

      // THEN
      const file = await storage.readById(response.fileId)
      expect(file).toBeDefined()
      expect(file?.name).toBe('output.docx')
    })
  })
})
