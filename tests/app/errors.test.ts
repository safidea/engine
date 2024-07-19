import { test, expect } from '@tests/fixtures'
import App from '@safidea/engine'

test.describe('App schema errors', () => {
  test('should throw an error if config is empty', async () => {
    // GIVEN
    const config = {}
    const app = new App()

    // WHEN
    const call = () => app.start(config)

    // THEN
    await expect(call).rejects.toThrowError("must have required property 'name'")
  })
})
