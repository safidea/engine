import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import { nanoid } from 'nanoid'
import fs from 'fs-extra'
import { join } from 'path'

test.describe('Logger', () => {
  test.describe('File driver', () => {
    test('should log "app started"', async () => {
      // GIVEN
      const filename = join(process.cwd(), 'tmp', `app-${nanoid()}.log`)
      fs.ensureFileSync(filename)
      const config: Config = {
        name: 'app',
        logger: {
          driver: 'File',
          level: 'debug',
          filename,
        },
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
      } while (!content.includes('app started') && i < 10)
      expect(content).toContain('app started')
    })
  })

  test.describe('ElasticSearch driver', () => {
    test('should start an app', async () => {
      // GIVEN
      const config: Config = {
        name: 'app',
        logger: {
          driver: 'ElasticSearch',
          level: 'debug',
          url: 'http://localhost:9200',
        },
      }
      const app = new App()

      // WHEN
      const call = () => app.start(config)

      // THEN
      await expect(call()).resolves.not.toThrow()
    })
  })
})
