import { test, expect } from '@playwright/test'
import type { IComponent } from '@solumy/engine/component'
import { Feature, type IFeature } from '@solumy/engine/feature'

test.describe('Feature specs', () => {
  test.skip('should fail a spec', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'Feature',
      story: {
        asRole: 'Role',
        iWant: 'I want',
        soThat: 'So that',
      },
      specs: [
        {
          name: 'Spec',
          when: [{ open: '/' }],
          then: [{ text: 'text' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'text',
            },
          ],
        },
      ],
    }
    const components: IComponent[] = [
      {
        name: 'text',
        template: 'invalid',
      },
    ]

    // WHEN
    const feature = new Feature(config, { roles: [{ name: 'Role' }], components })
    const errors = await feature.testSpecs()

    // THEN
    expect(errors).toHaveLength(1)
  })
})
