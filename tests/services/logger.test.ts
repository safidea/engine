import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import { nanoid } from 'nanoid'
import fs from 'fs-extra'
import { join } from 'path'
import { elasticSearch, type Hit } from '@tests/logger'

test.describe('Logger', () => {
  test.describe('File driver', () => {
    test('should log "started" info', async () => {
      // GIVEN
      const filename = join(process.cwd(), 'tmp', `app-${nanoid()}.log`)
      fs.ensureFileSync(filename)
      const config: Config = {
        name: 'app',
        loggers: [
          {
            driver: 'File',
            filename,
          },
        ],
      }
      const app = new App()

      // WHEN
      await app.start(config)

      // THEN
      let content = ''
      let i = 0
      do {
        if (i++ > 0) await new Promise((resolve) => setTimeout(resolve, 1000))
        content = await fs.readFile(filename, 'utf8')
      } while (!content.includes('started') && i < 10)
      expect(content).toContain('started')
    })

    test('should log a succeed automation', async ({ request }) => {
      // GIVEN
      const filename = join(process.cwd(), 'tmp', `app-${nanoid()}.log`)
      fs.ensureFileSync(filename)
      const config: Config = {
        name: 'app',
        automations: [
          {
            name: 'run',
            trigger: {
              event: 'ApiCalled',
              path: 'run',
            },
            actions: [
              {
                name: 'run',
                service: 'Code',
                action: 'RunJavascript',
                code: `return { message: 'succeed' }`,
              },
            ],
          },
        ],
        loggers: [
          {
            driver: 'File',
            filename,
          },
        ],
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      await request.post(`${url}/api/automation/run`)

      // THEN
      let content = ''
      let i = 0
      do {
        if (i++ > 0) await new Promise((resolve) => setTimeout(resolve, 1000))
        content = await fs.readFile(filename, 'utf8')
      } while (!content.includes('run succeed') && i < 10)
      expect(content).toContain('run succeed')
    })

    test('should log a failed automation', async ({ request }) => {
      // GIVEN
      const filename = join(process.cwd(), 'tmp', `app-${nanoid()}.log`)
      fs.ensureFileSync(filename)
      const config: Config = {
        name: 'app',
        automations: [
          {
            name: 'run',
            trigger: {
              event: 'ApiCalled',
              path: 'run',
            },
            actions: [
              {
                name: 'run',
                service: 'Code',
                action: 'RunJavascript',
                code: `throw new Error('run failed')`,
              },
            ],
          },
        ],
        loggers: [
          {
            driver: 'File',
            filename,
          },
        ],
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      await request.post(`${url}/api/automation/run`)

      // THEN
      let content = ''
      let i = 0
      do {
        if (i++ > 0) await new Promise((resolve) => setTimeout(resolve, 1000))
        content = await fs.readFile(filename, 'utf8')
      } while (!content.includes('run failed') && i < 10)
      expect(content).toContain('run failed')
    })
  })

  test.describe('ElasticSearch driver', () => {
    test('should start an app with ES config', async ({ request }) => {
      // GIVEN
      const id = nanoid()
      const message = `Test error ${id} for ElasticSearch`
      const config: Config = {
        name: 'app',
        automations: [
          {
            name: 'throwError',
            trigger: {
              event: 'ApiCalled',
              path: 'error',
            },
            actions: [
              {
                name: 'throwError',
                service: 'Code',
                action: 'RunJavascript',
                code: `throw new Error("${message}")`,
              },
            ],
          },
        ],
        loggers: [
          {
            driver: 'ElasticSearch',
            url: elasticSearch.url,
            index: elasticSearch.index,
          },
        ],
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      await request.post(`${url}/api/automation/error`)

      // THEN
      let hit: Hit | undefined
      do {
        const hits = await elasticSearch.search(message)
        hit = hits.find((hit) => hit._source.message.includes(message))
        if (!hit) await new Promise((resolve) => setTimeout(resolve, 1000))
      } while (!hit)
      expect(hit).toBeDefined()
      expect(hit._source.message).toContain(message)
    })

    test("should create an ES index if it doesn't exit at start", async () => {
      // GIVEN
      const id = nanoid()
      const index = `test_index_${id}`.toLowerCase()
      const config: Config = {
        name: 'app',
        loggers: [
          {
            driver: 'ElasticSearch',
            url: elasticSearch.url,
            index,
          },
        ],
      }
      const app = new App()

      // WHEN
      await app.start(config)

      // THEN
      const exists = await elasticSearch.checkIndex(index)
      await elasticSearch.deleteIndex(index)
      expect(exists).toBe(true)
    })
  })
})
