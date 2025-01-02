import { test, expect, NodeApp } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test('should wait for an automation', async () => {
  // GIVEN
  const config: Config = {
    name: 'Feature',
    tests: [
      {
        name: 'create a row',
        when: [
          { event: 'Post', path: '/api/automation/new-lead', body: { name: 'John' } },
          { event: 'WaitForAutomation', automation: 'New lead' },
        ],
        then: [
          {
            expect: 'Record',
            table: 'leads',
            find: {
              field: 'name',
              operator: 'Is',
              value: 'John',
            },
          },
        ],
      },
    ],
    automations: [
      {
        name: 'New lead',
        trigger: {
          service: 'Http',
          event: 'WebhookCalled',
          path: 'new-lead',
        },
        actions: [
          {
            name: 'create-lead',
            service: 'Database',
            action: 'CreateRecord',
            table: 'leads',
            fields: {
              name: '{{ trigger.body.name }}',
            },
          },
        ],
      },
    ],
    tables: [
      {
        name: 'leads',
        fields: [
          {
            name: 'name',
            field: 'SingleLineText',
          },
        ],
      },
    ],
  }

  // WHEN
  const app = new NodeApp()
  const call = () => app.test(config)

  // THEN
  await expect(call()).resolves.toBeUndefined()
})

test('should find an email in mailbox', async () => {
  // GIVEN
  const config: Config = {
    name: 'Feature',
    tests: [
      {
        name: 'send an email',
        when: [
          { event: 'Post', path: '/api/automation/send-email', body: { email: 'test@test.com' } },
          { event: 'WaitForAutomation', automation: 'send-email' },
        ],
        then: [
          {
            expect: 'Email',
            mailbox: 'test@test.com',
          },
        ],
      },
    ],
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
            name: 'send-email',
            service: 'Mailer',
            action: 'SendEmail',
            to: '{{ trigger.body.email }}',
            from: 'noreply@test.com',
            subject: 'New email',
            text: 'You have a new email!',
            html: '<p>You have a new email!</p>',
          },
        ],
      },
    ],
  }

  // WHEN
  const app = new NodeApp()
  const call = () => app.test(config)

  // THEN
  await expect(call()).resolves.toBeUndefined()
})

test('should return a success API request', async () => {
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
  const app = new NodeApp()
  const call = () => app.test(config)

  // THEN
  await expect(call()).resolves.toBeUndefined()
})

test('should return a failed API request', async () => {
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
  const app = new NodeApp()
  const call = () => app.test(config)

  // THEN
  await expect(call()).rejects.toThrow('EQUAL_FAILED')
})
