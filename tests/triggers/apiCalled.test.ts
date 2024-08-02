import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('ApiCalled trigger', () => {
  test('should start an automation from api call', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'ApiCalled',
          trigger: {
            trigger: 'ApiCalled',
            path: 'run-api',
          },
          actions: [],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const res = await request.post(`${url}/api/automation/run-api`)

    // THEN
    expect(res.ok()).toBeTruthy()
    const { success } = await res.json()
    expect(success).toBeTruthy()
  })
})
