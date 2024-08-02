import { test, expect, js } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Run javascript code action', () => {
  test('should run a javascript code', async ({ request }) => {
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
              numberOne: { type: 'number' },
              numberTwo: { type: 'number' },
            },
            output: {
              sum: {
                value: '{{runJavascriptCode.result}}',
                type: 'number',
              },
            },
          },
          actions: [
            {
              action: 'RunJavascriptCode',
              name: 'runJavascriptCode',
              input: {
                numberOne: {
                  value: '{{trigger.body.numberOne}}',
                  type: 'number',
                },
                numberTwo: {
                  value: '{{trigger.body.numberTwo}}',
                  type: 'number',
                },
              },
              code: js`
                  const { numberOne, numberTwo } = inputData
                  return { result: numberOne + numberTwo }
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
    expect(response.sum).toBe(3)
  })
})
