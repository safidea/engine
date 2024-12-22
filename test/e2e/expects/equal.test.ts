import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test('should return a success equal', async () => {
  // GIVEN
  const config: Config = {
    name: 'Feature',
    tests: [
      {
        name: 'valid a name',
        when: [
          {
            name: 'request',
            event: 'Post',
            path: '/api/automation/valid-name',
            body: { name: 'John' },
          },
        ],
        then: [
          {
            expect: 'Equal',
            value: '{{request.isValid}}',
            equal: 'true',
          },
        ],
      },
    ],
    automations: [
      {
        name: 'validName',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'valid-name',
          input: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
          output: {
            isValid: {
              boolean: '{{runJavascriptCode.isValid}}',
            },
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunJavascript',
            name: 'runJavascriptCode',
            input: {
              name: '{{trigger.body.name}}',
            },
            // eslint-disable-next-line
            // @ts-ignore
            code: String(async function (context) {
              const { inputData } = context
              const isValid = inputData.name === 'John'
              return { isValid }
            }),
          },
        ],
      },
    ],
  }

  // WHEN
  const app = new App()
  const call = () => app.test(config)

  // THEN
  await expect(call()).resolves.toBeUndefined()
})

test('should return a failed equal', async () => {
  // GIVEN
  const config: Config = {
    name: 'Feature',
    tests: [
      {
        name: 'valid a name',
        when: [
          {
            name: 'request',
            event: 'Post',
            path: '/api/automation/valid-name',
            body: { name: 'John' },
          },
        ],
        then: [
          {
            expect: 'Equal',
            value: '{{request.isValid}}',
            equal: 'true',
          },
        ],
      },
    ],
    automations: [
      {
        name: 'validName',
        trigger: {
          service: 'Http',
          event: 'ApiCalled',
          path: 'valid-name',
          input: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
          output: {
            isValid: {
              boolean: '{{runJavascriptCode.isValid}}',
            },
          },
        },
        actions: [
          {
            service: 'Code',
            action: 'RunJavascript',
            name: 'runJavascriptCode',
            input: {
              name: '{{trigger.body.name}}',
            },
            // eslint-disable-next-line
            // @ts-ignore
            code: String(async function (context) {
              const { inputData } = context
              const isValid = inputData.name === 'Doe'
              return { isValid }
            }),
          },
        ],
      },
    ],
  }

  // WHEN
  const app = new App()
  const call = () => app.test(config)

  // THEN
  await expect(call()).rejects.toThrow('EQUAL_FAILED')
})
