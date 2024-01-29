import { test, expect } from '@playwright/test'
import { createFeature, type IFeature } from '@solumy/engine/feature'

test.describe('Tables specs', () => {
  test.skip('should create a row', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'Feature',
      specs: [
        {
          name: 'create a row',
          when: [{ post: '/api/table/leads', body: { name: 'John' } }],
          then: [{ table: 'leads', rows: [{ name: 'John' }] }],
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
    const { feature } = await createFeature(config)
    const errors = await feature!.testSpecs()

    // THEN
    expect(errors).toHaveLength(0)
  })
})
