import { test, expect } from '@playwright/test'
import { createApp, AppError, type IApp } from '@solumy/engine'
import { FeatureError } from '@solumy/engine/feature'

test.describe('App schema errors', () => {
  test('empty config should return 5 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const { errors } = createApp(config)

    // THEN
    expect(errors).toHaveLength(2)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const { errors } = createApp(config)

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
    const { errors } = createApp(config)

    // THEN
    const error = errors?.find((e) => e.code === 'APP_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('roles should be an array', async () => {
    // GIVEN
    const config = {
      name: 'app',
      features: [],
      roles: 1,
    }

    // WHEN
    const { errors } = createApp(config)

    // THEN
    const error = errors?.find((e) => e.code === 'APP_ERROR_ROLES_ARRAY_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('features should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const { errors } = createApp(config)

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
    const { errors } = createApp(config)

    // THEN
    const error = errors?.find((e) => e.code === 'APP_ERROR_FEATURES_ARRAY_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('translations should be an array', async () => {
    // GIVEN
    const config = {
      translations: 1,
    }

    // WHEN
    const { errors } = createApp(config)

    // THEN
    const error = errors?.find((e) => e.code === 'APP_ERROR_TRANSLATIONS_ARRAY_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const { errors } = createApp(config)

    // THEN
    const error = errors?.find((e) => e.code === 'APP_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppError)
    expect((error as AppError).data?.property).toBe('unknown')
  })
})

test.describe('App config errors', () => {
  test('app feature story "asRole" should be a defined role', async () => {
    // GIVEN
    const config: IApp = {
      name: 'app',
      features: [
        {
          name: 'feature',
          role: 'unknown',
        },
      ],
    }

    // WHEN
    const { errors } = createApp(config)

    // THEN
    const error = errors?.find((e) => e.code === 'FEATURE_ERROR_ROLE_NOT_FOUND')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
    if (!error) return
    const data = error.data
    expect(data).toBeDefined()
    expect(data).toHaveProperty('feature')
    if (data && 'feature' in data) expect(data.feature).toBe('feature')
    expect(data).toHaveProperty('role')
    if (data && 'role' in data) expect(data.role).toBe('unknown')
  })
})
