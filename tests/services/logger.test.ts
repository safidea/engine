import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import { nanoid } from 'nanoid'
import fs from 'fs-extra'
import { join } from 'path'

test.describe('Logger', () => {
  test.describe('Console driver', () => {
    test.describe('DEBUG level', () => {
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
        const content = await fs.readFile(filename, 'utf8')
        expect(content).toContain('app started')
      })
    })
  })
})
