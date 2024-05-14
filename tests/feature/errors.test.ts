import { test, expect } from '@tests/fixtures'
import Feature from '@safidea/engine/feature'

test.describe('Feature schema errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Feature().getSchemaErrors(config)

    // THEN
    expect(errors).toHaveLength(1)
  })
})
