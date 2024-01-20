import { test, expect } from '@playwright/test'
import {
  App,
  AppNameRequiredError,
  AppRolesRequiredError,
  AppFeaturesRequiredError,
  AppUnknownPropertyError,
  AppComponentsRequiredError,
  AppTranslationsRequiredError,
} from '@solumy/engine/app'

test.describe('App class', () => {
  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppNameRequiredError)
  })

  test('roles should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'ROLES_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppRolesRequiredError)
  })

  test('features should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'FEATURES_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppFeaturesRequiredError)
  })

  test('components should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'COMPONENTS_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppComponentsRequiredError)
  })

  test('translations should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const error = app.errors.find((e) => e.message === 'TRANSLATIONS_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(AppTranslationsRequiredError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      name: 'test',
      roles: [],
      features: [],
      unknown: 'unknown',
    }

    // WHEN
    const app = new App(config)

    // THEN
    const unknownError = app.errors.find((e) => e.message === 'UNKNOWN_PROPERTY')
    expect(unknownError).toBeDefined()
    expect(unknownError).toBeInstanceOf(AppUnknownPropertyError)
    expect((unknownError as AppUnknownPropertyError).property).toBe('unknown')
  })
})
