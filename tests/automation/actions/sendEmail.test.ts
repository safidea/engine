import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'
import Mailer from '@tests/mailer'

test.describe('Send email action', () => {
  test.skip('should send an email', async ({ request }) => {
    // GIVEN
    const database = new Database()
    const mailer = new Mailer(database)
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'send-email',
          automations: [
            {
              name: 'send-email',
              trigger: {
                event: 'WebhookCalled',
                path: 'send-email',
                method: 'POST',
              },
              actions: [
                {
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
        },
      ],
      mailer: mailer.config,
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await request.post(`${url}/api/automation/send-email`)

    // THEN
    const emails = await database.table('_emails').list([])
    expect(emails).toHaveLength(1)
  })
})
