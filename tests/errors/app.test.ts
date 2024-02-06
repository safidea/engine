import { test, expect } from '@playwright/test'
import App, { AppError } from '@solumy/engine'

test.describe('app schema errors', () => {
  test('empty config should return 2 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new App(config).getErrors()

    // THEN
    expect(errors).toHaveLength(2)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new App(config).getErrors()

    // THEN
    const error = errors?.find((e) => e.code === 'APP_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const errors = new App(config).getErrors()

    // THEN
    const error = errors?.find((e) => e.code === 'APP_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('features should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const errors = new App(config).getErrors()

    // THEN
    const error = errors?.find((e) => e.code === 'APP_ERROR_FEATURES_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('features should be an array', async () => {
    // GIVEN
    const config = {
      features: 1,
    }

    // WHEN
    const errors = new App(config).getErrors()

    // THEN
    const error = errors?.find((e) => e.code === 'APP_ERROR_FEATURES_ARRAY_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const errors = new App(config).getErrors()

    // THEN
    const error = errors?.find((e) => e.code === 'APP_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
    expect((error as AppError).data?.property).toBe('unknown')
  })
})
