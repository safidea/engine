import { test, expect } from '@playwright/test'
import { Feature, FeatureError, type IFeature } from '@solumy/engine/feature'

const params = { roles: [], components: [] }

test.describe('Feature errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Feature(config, params)

    // THEN
    expect(app.errors).toHaveLength(4)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Feature(config, params)

    // THEN
    const error = app.errors.find((e) => e.code === 'FEATURE_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const app = new Feature(config, params)

    // THEN
    const error = app.errors.find((e) => e.code === 'FEATURE_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const app = new Feature(config, params)

    // THEN
    const error = app.errors.find((e) => e.code === 'FEATURE_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
    expect((error as FeatureError).data?.property).toBe('unknown')
  })
})

test.describe('Feature config errors', () => {
  test('feature story "asRole" should be a defined role', async () => {
    // GIVEN
    const config: IFeature = {
      name: 'feature',
      story: {
        asRole: 'unknown',
        iWant: 'lorem ipsum',
        soThat: 'lorem ipsum',
      },
      specs: [],
      pages: [],
    }

    // WHEN
    const feature = new Feature(config, params)

    // THEN
    const error = feature.errors.find((e) => e.code === 'FEATURE_ERROR_STORY_AS_ROLE_NOT_FOUND')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(FeatureError)
    expect((error as FeatureError).data?.feature).toBe('feature')
    expect((error as FeatureError).data?.role).toBe('unknown')
  })
})
