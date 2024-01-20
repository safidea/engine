import { test, expect } from '@playwright/test'
import { Spec, SpecError } from '@solumy/engine/spec'

test.describe('Spec schema errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Spec(config)

    // THEN
    expect(app.errors).toHaveLength(3)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Spec(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'SPEC_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(SpecError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const app = new Spec(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'SPEC_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(SpecError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const app = new Spec(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'SPEC_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(SpecError)
    expect((error as SpecError).data?.property).toBe('unknown')
  })
})
