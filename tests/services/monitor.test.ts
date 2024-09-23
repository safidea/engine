import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import { getSentryEvents } from '@tests/monitor'
import { nanoid } from 'nanoid'

test.describe('Monitor', () => {
  test.describe('Sentry driver', () => {
    test.slow()

    test.only('should send an error', async ({ request }) => {
      // GIVEN
      const id = nanoid()
      const message = `Test error ${id} for Sentry`
      const config: Config = {
        name: 'Theme',
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
        monitor: {
          driver: 'Sentry',
        },
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      await request.post(`${url}/api/automation/error`)

      // THEN
      let errorEvent
      do {
        const events = await getSentryEvents()
        errorEvent = events.find((event: { title: string }) => event.title.includes(message))
        if (!errorEvent) await new Promise((resolve) => setTimeout(resolve, 1000))
      } while (!errorEvent)
      expect(errorEvent).toBeDefined()
      expect(errorEvent.title).toContain(message)
    })
  })
})
