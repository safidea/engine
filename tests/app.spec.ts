import { test, expect } from '@playwright/test'
import {
  App,
  AppNameRequiredError,
  AppRolesRequiredError,
  AppFeaturesRequiredError,
  UnknownAppPropertyError,
  AppComponentsRequiredError,
  AppTranslationsRequiredError,
} from '@solumy/engine/app'

test.describe('App class', () => {
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
    const error = app.errors.find((e) => e.message === 'APP_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppNameRequiredError)
  })

  test('roles should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'APP_ROLES_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppRolesRequiredError)
  })

  test('features should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'APP_FEATURES_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppFeaturesRequiredError)
  })

  test('components should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'APP_COMPONENTS_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppComponentsRequiredError)
  })

  test('translations should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'APP_TRANSLATIONS_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppTranslationsRequiredError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'UNKNOWN_APP_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(UnknownAppPropertyError)
    expect((error as UnknownAppPropertyError).property).toBe('unknown')
  })
})
