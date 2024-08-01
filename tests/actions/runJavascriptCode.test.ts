import { test, expect, js } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Run javascript code action', () => {
  test.skip('should run a javascript code', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'addNumbers',
          trigger: {
            trigger: 'ApiCalled',
            path: 'add-numbers',
            input: {
              type: 'object',
              properties: {
                numberOne: { type: 'number' },
                numberTwo: { type: 'number' },
              },
            },
            output: {
              sum: '{{runJavascriptCode.result}}',
            },
          },
          actions: [
            {
              action: 'RunJavascriptCode',
              name: 'runJavascriptCode',
              input: {
                numberOne: '{{trigger.numberOne}}',
                numberTwo: '{{trigger.numberTwo}}',
              },
              code: js`
                  const { numberOne, numberTwo } = input
                  return Number(numberOne) + Number(numberTwo)
                `,
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const { response } = await request
      .post(`${url}/api/automation/add-numbers`, {
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
