import { test, expect } from '@playwright/test'
import { createFeature, FeatureError, type IFeature } from '@solumy/engine/feature'

test.describe('Feature schema errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const { errors } = await createFeature(config)

    // THEN
    expect(errors).toHaveLength(1)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const { errors } = await createFeature(config)

    // THEN
    const error = errors?.find((e) => e.code === 'FEATURE_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const { errors } = await createFeature(config)

    // THEN
    const error = errors?.find((e) => e.code === 'FEATURE_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const { errors } = await createFeature(config)

    // THEN
    const error = errors?.find((e) => e.code === 'FEATURE_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
    if (!error) return
    const data = error.data
    expect(data).toBeDefined()
    expect(data).toHaveProperty('property')
    if (data && 'property' in data) expect(data.property).toBe('unknown')
  })
})

test.describe('Feature config errors', () => {
  test('feature role should be a defined role', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'feature',
      role: 'unknown',
    }

    // WHEN
    const { errors } = await createFeature(config)

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
