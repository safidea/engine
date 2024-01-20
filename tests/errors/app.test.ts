import { test, expect } from '@playwright/test'
import { App, AppError } from '@solumy/engine/app'

test.describe('App errors', () => {
  test('empty config should return 5 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    expect(app.errors).toHaveLength(5)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e: AppError) => e.code === 'APP_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'APP_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('roles should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'APP_ERROR_ROLES_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('roles should be an array', async () => {
    // GIVEN
    const config = {
      roles: 1,
    }

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'APP_ERROR_ROLES_ARRAY_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('features should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'APP_ERROR_FEATURES_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('features should be an array', async () => {
    // GIVEN
    const config = {
      features: 1,
    }

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'APP_ERROR_FEATURES_ARRAY_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('components should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'APP_ERROR_COMPONENTS_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('components should be an array', async () => {
    // GIVEN
    const config = {
      components: 1,
    }

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'APP_ERROR_COMPONENTS_ARRAY_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('translations should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'APP_ERROR_TRANSLATIONS_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('translations should be an array', async () => {
    // GIVEN
    const config = {
      translations: 1,
    }

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'APP_ERROR_TRANSLATIONS_ARRAY_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.code === 'APP_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
    expect((error as AppError).data?.property).toBe('unknown')
  })
})
