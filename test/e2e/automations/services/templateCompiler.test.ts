import { test, expect, NodeApp } from '@test/fixtures'
import App, { type CodeRunnerContext, type Config } from '@latechforce/engine'

test('should convert a date from a format to another format', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    automations: [
      {
        name: 'run',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'run',
          input: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
              },
            },
          },
          output: {
            date: '{{run.date}}',
          },
        },
        actions: [
          {
            name: 'run',
            service: 'Code',
            action: 'RunJavascript',
            input: {
              date: '{{formatDate trigger.body.date "yyyy-MM-dd" "dd/MM/yyyy"}}',
            },
            code: String(function (context: CodeRunnerContext<{ inputData: { date: string } }>) {
              return context.inputData
            }),
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const { date } = await request
    .post(`${url}/api/automation/run`, {
      data: { date: '2022-01-01' },
    })
    .then((res) => res.json())

  // THEN
  expect(date).toBe('01/01/2022')
})
