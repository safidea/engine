import { test, expect } from '@playwright/test'
import Automation from '@solumy/engine/automation'

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
