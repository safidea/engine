import { test, expect } from '@tests/fixtures'
import Automation from '@safidea/engine/automation'

test.describe('Automations schema errors', () => {
  test('empty config should return 3 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new Automation().getSchemaErrors(config)

    // THEN
    expect(errors).toHaveLength(3)
  })
})
