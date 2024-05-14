import { test, expect } from '@tests/fixtures'
import Page from '@safidea/engine/page'

test.describe('Page schema errors', () => {
  test('empty config should return 3 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Page().getSchemaErrors(config)

    // THEN
    expect(errors).toHaveLength(3)
  })
})
