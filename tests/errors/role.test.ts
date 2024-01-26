import { test, expect } from '@playwright/test'
import { createRole, RoleError } from '@solumy/engine/role'

test.describe('Role schema errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const { errors } = await createRole(config)

    // THEN
    expect(errors).toHaveLength(1)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const { errors } = await createRole(config)

    // THEN
    const error = errors?.find((e) => e.code === 'ROLE_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(RoleError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const { errors } = await createRole(config)

    // THEN
    const error = errors?.find((e) => e.code === 'ROLE_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(RoleError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const { errors } = await createRole(config)

    // THEN
    const error = errors?.find((e) => e.code === 'ROLE_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(RoleError)
    expect((error as RoleError).data?.property).toBe('unknown')
  })
})
