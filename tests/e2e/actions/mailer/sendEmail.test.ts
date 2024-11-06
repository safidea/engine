import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@latechforce/engine'
import Database from '@tests/drivers/database'
import Mailer from '@tests/drivers/mailer'

test.describe('Send email action', () => {
  test.slow()

  Database.each(test, (dbConfig) => {
    test('should send an email', async ({ request }) => {
      // GIVEN
      const mailer = new Mailer()
      const config: Config = {
        name: 'App',
        automations: [
          {
            name: 'send-email',
            trigger: {
              service: 'Http',
              event: 'WebhookCalled',
              path: 'send-email',
            },
            actions: [
              {
                service: 'Mailer',
                action: 'SendEmail',
                name: 'send-email',
                to: 'to@test.com',
                from: 'from@test.com',
                subject: 'Welcome',
                text: 'Hello world',
                html: 'Hello world',
              },
            ],
          },
        ],
        mailer: mailer.config,
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      await request.post(`${url}/api/automation/send-email`)

      // THEN
      const email = await mailer.waitForEmail([
        { field: 'to', operator: '=', value: 'to@test.com' },
      ])
      expect(email.to).toBe('to@test.com')
      expect(email.from).toBe('from@test.com')
    })
  })
})
