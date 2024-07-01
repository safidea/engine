import { test, expect } from '@tests/fixtures'
import App from '@safidea/engine'

test.describe('App schema errors', () => {
  test('should return 2 errors if config is empty', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new App().getSchemaErrors(config)

    // THEN
    expect(errors).toHaveLength(2)
  })
})
