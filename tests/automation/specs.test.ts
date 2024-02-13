import { test, expect } from '@playwright/test'
import Feature, { type Config } from '@solumy/engine/feature'

test.describe.skip('Automations specs', () => {
  test('should wait for an automation', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      specs: [
        {
          name: 'create a row',
          when: [
            { post: '/api/automation/new-lead', body: { name: 'John' } },
            { waitForAutomation: 'new-lead' },
          ],
          then: [
            {
              table: 'leads',
              findOne: [
                {
                  field: 'name',
                  operator: 'is',
                  value: 'John',
                },
              ],
            },
          ],
        },
      ],
      automations: [
        {
          name: 'New lead',
          trigger: {
            event: 'WebhookCalled',
            method: 'POST',
            path: 'new-lead',
          },
          actions: [
            {
              name: 'create-lead',
              action: 'CreateRecord',
              table: 'leads',
              fields: {
                name: '{{trigger.name}}',
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
              type: 'SingleLineText',
            },
          ],
        },
      ],
    }

    // WHEN
    const feature = new Feature()
    const errors = await feature.test(config)

    // THEN
    expect(errors).toHaveLength(0)
  })
})
