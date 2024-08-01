import { test, expect, js } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Run javascript code action', () => {
  test.skip('should run a javascript code in a webhook automation', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'addNumbers',
          trigger: {
            trigger: 'WebhookCalled',
            path: 'runJavascriptCode',
            method: 'POST',
            waitForWebhookResponse: true,
          },
          actions: [
            {
              action: 'RunJavascriptCode',
              name: 'runJavascriptCode',
              inputs: {
                numberOne: '{{trigger.numberOne}}',
                numberTwo: '{{trigger.numberTwo}}',
              },
              code: js`
                  const { numberOne, numberTwo } = inputs
                  return Number(numberOne) + Number(numberTwo)
                `,
            },
            {
              action: 'WebhookResponse',
              name: 'webhookResponse',
              body: {
                result: '{{runJavascriptCode.result}}',
              },
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const { response } = await request
      .post(`${url}/api/automation/addNumbers`, {
        data: {
          numberOne: 1,
          numberTwo: 2,
        },
      })
      .then((res) => res.json())

    // THEN
    expect(response.result).toBe(3)
  })
})
