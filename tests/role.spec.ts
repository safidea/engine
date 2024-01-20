import { test, expect } from '@playwright/test'
import { Role } from '@solumy/engine/role'

test.describe('Role class', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Role(config)

    // THEN
    expect(app.errors).toHaveLength(1)
  })
})
