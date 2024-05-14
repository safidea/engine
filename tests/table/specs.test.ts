import { test, expect } from '@tests/fixtures'
import Feature, { type Config } from '@safidea/engine/feature'

test.describe('Tables specs', () => {
  test('should not find a created row', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      specs: [
        {
          name: 'create a row',
          when: [{ post: '/api/table/leads', body: { name: 'Doe' } }],
          then: [{ table: 'leads', find: [{ field: 'name', operator: 'is', value: 'John' }] }],
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
    expect(errors).toHaveLength(1)
    const [{ expected, received, code }] = errors
    expect(code).toBe('RECORD_NOT_FOUND')
    expect(expected).toBe(JSON.stringify({ name: 'John' }))
    expect(received).toBeUndefined()
  })

  test('should find a created row', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      specs: [
        {
          name: 'create a row',
          when: [{ post: '/api/table/leads', body: { name: 'John' } }],
          then: [{ table: 'leads', find: [{ field: 'name', operator: 'is', value: 'John' }] }],
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
