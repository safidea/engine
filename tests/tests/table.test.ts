import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@safidea/engine'

test.describe('Table tests', () => {
  test('should not find a created row', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'create a row',
          when: [{ event: 'Post', path: '/api/table/leads', body: { name: 'Doe' } }],
          then: [
            {
              expect: 'Record',
              table: 'leads',
              find: [{ field: 'name', operator: 'is', value: 'John' }],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).rejects.toThrow('RECORD_NOT_FOUND')
  })

  test('should find a created row', async () => {
    // GIVEN
    const config: Config = {
      name: 'Feature',
      tests: [
        {
          name: 'create a row',
          when: [{ event: 'Post', path: '/api/table/leads', body: { name: 'John' } }],
          then: [
            {
              expect: 'Record',
              table: 'leads',
              find: [{ field: 'name', operator: 'is', value: 'John' }],
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
    const app = new App()
    const call = () => app.test(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
  })
})
