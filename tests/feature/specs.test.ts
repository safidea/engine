import { test, expect } from '@tests/fixtures'
import Feature, { type Feature as Config } from '@safidea/engine/feature'

test.describe('Feature specs', () => {
  test('should run multiples specs in parallel', async () => {
    // GIVEN
    const config: Config = {
      name: 'get-started-page',
      specs: [
        {
          name: 'should display the page title',
          when: [
            {
              open: '/get-started',
            },
          ],
          then: [
            {
              title: 'Request - Get Started',
            },
          ],
        },
        {
          name: 'should display the form',
          when: [
            {
              open: '/get-started',
            },
          ],
          then: [
            {
              text: 'Get Started',
              tag: 'h4',
            },
            {
              text: 'Get started with Request',
              tag: 'p',
            },
            {
              text: 'Send message',
              tag: 'button',
            },
          ],
        },
        {
          name: 'should submit the form',
          when: [
            {
              open: '/get-started',
            },
            {
              fill: 'email',
              value: 'test@test.com',
            },
            {
              fill: 'name',
              value: 'John Doe',
            },
            {
              fill: 'subject',
              value: 'I would like to get started with Request.',
            },
            {
              fill: 'message',
              value: 'Hello, I would like to get started with Request.',
            },
            {
              click: 'Send message',
            },
            {
              waitForText: 'Your message has been sent.',
            },
            {
              waitForAutomation: 'send-confirmation-email',
            },
          ],
          then: [
            {
              text: 'Your message has been sent.',
              tag: 'p',
            },
            {
              table: 'leads',
              find: [
                {
                  field: 'email',
                  operator: 'is',
                  value: 'test@test.com',
                },
              ],
            },
            {
              mailbox: 'test@test.com',
              find: [
                {
                  field: 'subject',
                  operator: 'is',
                  value: 'Thank you for your interest in Request',
                },
              ],
            },
          ],
        },
      ],
      pages: [
        {
          name: 'get-started',
          path: '/get-started',
          head: {
            title: 'Request - Get Started',
            metas: [
              {
                name: 'description',
                content: 'Get started with Request',
              },
            ],
          },
          body: [
            {
              component: 'Form',
              action: '/api/table/leads',
              method: 'POST',
              title: { text: 'Get Started' },
              paragraph: { text: 'Get started with Request' },
              inputs: [
                {
                  name: 'email',
                  label: 'Your email',
                  placeholder: 'name@solumy.com',
                  type: 'email',
                  required: true,
                },
                {
                  name: 'name',
                  label: 'Your name',
                  placeholder: 'John Doe',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'subject',
                  label: 'Subject',
                  placeholder: 'I would like to get started with Request.',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'message',
                  label: 'Your message',
                  placeholder: 'Hello, I would like to get started with Request.',
                  type: 'text',
                  required: true,
                },
              ],
              buttons: [
                {
                  type: 'submit',
                  label: 'Send message',
                },
              ],
              successMessage: 'Your message has been sent.',
            },
            {
              component: 'Footer',
              title: { text: 'Request' },
              paragraph: { text: 'Request is a tech company based in Paris, France.' },
              links: [
                {
                  label: 'Home',
                  href: '/',
                },
                {
                  label: 'Get Started',
                  href: '/get-started',
                },
                {
                  label: 'Contact',
                  href: '/contact',
                },
              ],
              copyright: '© 2021 Request',
            },
          ],
        },
      ],
      tables: [
        {
          name: 'leads',
          fields: [
            {
              name: 'email',
              type: 'Email',
            },
            {
              name: 'name',
              type: 'SingleLineText',
            },
            {
              name: 'subject',
              type: 'SingleLineText',
            },
            {
              name: 'message',
              type: 'SingleLineText',
            },
          ],
        },
      ],
      automations: [
        {
          name: 'send-confirmation-email',
          trigger: {
            event: 'RecordCreated',
            table: 'leads',
          },
          actions: [
            {
              name: 'send-confirmation-email',
              action: 'SendEmail',
              from: 'noreply@solumy.com',
              to: '{{ trigger.email }}',
              subject: 'Thank you for your interest in Request',
              text: 'Thank you for your interest in Request. We will get back to you as soon as possible.',
              html: 'Thank you for your interest in Request. We will get back to you as soon as possible.',
            },
          ],
        },
      ],
    }
    const feature = new Feature()

    // WHEN
    const errors = await feature.test(config)

    // THEN
    expect(errors).toHaveLength(0)
  })
})
