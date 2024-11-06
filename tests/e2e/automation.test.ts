import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@latechforce/engine'
import Queue from '@tests/drivers/queue'
import Database from '@tests/drivers/database'
import Mailer from '@tests/drivers/mailer'

test.describe('App with automations', () => {
  Database.each(test, (dbConfig) => {
    test('should wait for a job to be completed', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const queue = new Queue(database)
      const mailer = new Mailer()
      const config: Config = {
        name: 'App',
        automations: [
          {
            name: 'Send email',
            trigger: {
              service: 'Http',
              event: 'WebhookCalled',
              path: 'send-email',
            },
            actions: [
              {
                name: 'send-email',
                service: 'Mailer',
                action: 'SendEmail',
                from: 'noreply@test.com',
                to: '{{ trigger.body.email }}',
                subject: 'New lead',
                text: 'A new lead has been created!',
                html: '<p>A new lead has been created!</p>',
              },
            ],
          },
        ],
        database: dbConfig,
        mailer: mailer.config,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      await request.post(`${url}/api/automation/send-email`, {
        data: { email: 'test@test.com' },
      })

      // THEN
      await expect(queue.waitForEmpty('send-email', 5000)).resolves.toBeTruthy()
    })
  })
})
