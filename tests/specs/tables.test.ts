import { test, expect } from '@playwright/test'
import { createFeature, type IFeature } from '@solumy/engine/feature'

test.describe('Tables specs', () => {
  test.skip('should not find a created row', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'Feature',
      specs: [
        {
          name: 'create a row',
          when: [{ post: '/api/table/leads', body: { name: 'Doe' } }],
          then: [{ table: 'leads', row: { name: 'John' } }],
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
    expect(errors).toHaveLength(1)
    const [{ data, code }] = errors
    expect(code).toBe('SPEC_ERROR_RECORD_NOT_FOUND')
    if (data && 'feature' in data) {
      expect(data.expected).toBe(JSON.stringify([{ name: 'John' }]))
      expect(data.received).toBe(JSON.stringify([{ name: 'Doe' }]))
    }
  })

  test.skip('should find a created row', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'Feature',
      specs: [
        {
          name: 'create a row',
          when: [{ post: '/api/table/leads', body: { name: 'John' } }],
          then: [{ table: 'leads', row: { name: 'John' } }],
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
