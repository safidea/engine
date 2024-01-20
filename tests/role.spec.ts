import { test, expect } from '@playwright/test'
import { Role, RoleNameRequiredError, UnknownRolePropertyError } from '@solumy/engine/role'

test.describe('Role class', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Role(config)

    // THEN
    expect(app.errors).toHaveLength(1)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Role(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'ROLE_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(RoleNameRequiredError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const app = new Role(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'UNKNOWN_ROLE_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(UnknownRolePropertyError)
    expect((error as UnknownRolePropertyError).property).toBe('unknown')
  })
})
