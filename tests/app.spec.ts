import { test, expect } from '@playwright/test'
import {
  App,
  AppNameRequiredError,
  AppRolesRequiredError,
  AppFeaturesRequiredError,
  AppUnknownPropertyError,
  AppComponentsRequiredError,
} from '@solumy/engine/app'

test.describe('App class', () => {
  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const nameError = app.errors.find((e) => e.message === 'NAME_REQUIRED')
    expect(nameError).toBeDefined()
    expect(nameError).toBeInstanceOf(AppNameRequiredError)
  })

  test('roles should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const rolesError = app.errors.find((e) => e.message === 'ROLES_REQUIRED')
    expect(rolesError).toBeDefined()
    expect(rolesError).toBeInstanceOf(AppRolesRequiredError)
  })

  test('features should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const featuresError = app.errors.find((e) => e.message === 'FEATURES_REQUIRED')
    expect(featuresError).toBeDefined()
    expect(featuresError).toBeInstanceOf(AppFeaturesRequiredError)
  })

  test('components should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    const componentsError = app.errors.find((e) => e.message === 'COMPONENTS_REQUIRED')
    expect(componentsError).toBeDefined()
    expect(componentsError).toBeInstanceOf(AppComponentsRequiredError)
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
