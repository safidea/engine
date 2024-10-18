import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@safidea/engine'
import Storage from '@tests/storage'
import Database from '@tests/database'
import mammoth from 'mammoth'

test.describe('Create .docx from template action', () => {
  Database.each(test, (dbConfig) => {
    test('should create a .docx file from a template', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const storage = new Storage(database)
      const config: Config = {
        name: 'App',
        automations: [
          {
            name: 'createDocument',
            trigger: {
              event: 'ApiCalled',
              path: 'create-document',
              input: {
                name: {
                  type: 'string',
                },
              },
              output: {
                fileId: {
                  value: '{{createDocument.file.id}}',
                  type: 'string',
                },
              },
            },
            actions: [
              {
                service: 'Document',
                action: 'CreateDocxFromTemplate',
                name: 'createDocument',
                input: {
                  name: {
                    value: '{{trigger.body.name}}',
                    type: 'string',
                  },
                },
                templatePath: './tests/__helpers__/docs/template.docx',
                fileName: 'output.docx',
                bucket: 'messages',
              },
            ],
          },
        ],
        buckets: [
          {
            name: 'messages',
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const response = await request
        .post(`${url}/api/automation/create-document`, {
          data: {
            name: 'John Doe',
          },
        })
        .then((res) => res.json())

      // THEN
      const file = await storage.bucket('messages').readById(response.fileId)
      const { value } = await mammoth.extractRawText({ buffer: file?.data ?? Buffer.from('') })
      expect(value).toContain('John Doe')
    })

    test('should create  a .docx file from a template with a custom filename', async ({
      request,
    }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const storage = new Storage(database)
      const config: Config = {
        name: 'App',
        automations: [
          {
            name: 'createDocument',
            trigger: {
              event: 'ApiCalled',
              path: 'create-document',
              input: {
                name: {
                  type: 'string',
                },
                filename: {
                  type: 'string',
                },
              },
              output: {
                fileId: {
                  value: '{{createDocument.file.id}}',
                  type: 'string',
                },
              },
            },
            actions: [
              {
                service: 'Document',
                action: 'CreateDocxFromTemplate',
                name: 'createDocument',
                input: {
                  name: {
                    value: '{{trigger.body.name}}',
                    type: 'string',
                  },
                },
                templatePath: './tests/__helpers__/docs/template.docx',
                fileName: '{{trigger.body.filename}}',
                bucket: 'messages',
              },
            ],
          },
        ],
        buckets: [
          {
            name: 'messages',
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const response = await request
        .post(`${url}/api/automation/create-document`, {
          data: {
            name: 'John Doe',
            filename: 'output.docx',
          },
        })
        .then((res) => res.json())

      // THEN
      const file = await storage.bucket('messages').readById(response.fileId)
      expect(file?.name).toBe('output.docx')
    })
  })
})
