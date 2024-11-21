import { test, expect } from '@tests/fixtures'
import App, { type CodeRunnerContext, type Config } from '@latechforce/engine'
import { instrument } from '@latechforce/engine/instrument'
import { getSentryEvents, type Event } from '@tests/drivers/monitor'
import { nanoid } from 'nanoid'

test.describe('Monitor', () => {
  test.describe('Sentry driver', () => {
    test.slow()

    test('should send an error', async ({ request }) => {
      // GIVEN
      const id = nanoid()
      const message = `Test error ${id} for Sentry`
      const dsn = process.env.SENTRY_DSN
      if (!dsn) throw new Error('SENTRY_DSN is not defined')
      const config: Config = {
        name: 'Logger',
        automations: [
          {
            name: 'throwError',
            trigger: {
              service: 'Http',
              event: 'ApiCalled',
              path: 'error',
            },
            actions: [
              {
                name: 'throwError',
                service: 'Code',
                action: 'RunJavascript',
                input: {
                  message,
                },
                code: String(function (context: CodeRunnerContext<{ message: string }>) {
                  const { inputData } = context
                  throw new Error(inputData.message)
                }),
              },
            ],
          },
        ],
        monitors: [
          {
            driver: 'Sentry',
            dsn,
            environment: 'test',
          },
        ],
      }
      instrument(config)
      const app = new App()
      const url = await app.start(config)

      // WHEN
      await request.post(`${url}/api/automation/error`)

      // THEN
      let event: Event | undefined
      do {
        const events = await getSentryEvents()
        event = events.find((event) => event.title.includes(message))
        if (!event) await new Promise((resolve) => setTimeout(resolve, 1000))
      } while (!event)
      expect(event).toBeDefined()
      expect(event.title).toContain(message)
    })
  })
})
