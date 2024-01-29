import { test, expect } from '@playwright/test'
import { createApp, type IApp } from '@solumy/engine'

test.describe('App with tables', () => {
  test.skip('should create a row', async ({ request }) => {
    // GIVEN
    const config: IApp = {
      name: 'App',
      features: [
        {
          name: 'Feature',
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
        },
      ],
    }
    const { app } = await createApp(config)
    const url = await app!.start()

    // WHEN
    const res = await request.post(`${url}/api/table/leads`, {
      data: { name: 'John' },
    })

    // THEN
    expect(res.ok()).toBeTruthy()
    const { record } = await res.json()
    expect(record).toBeDefined()
    expect(record.id).toBeDefined()
    expect(record.name).toBe('John')
  })
})
