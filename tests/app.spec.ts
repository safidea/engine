import { test, expect } from '@playwright/test'
import { App, AppError } from '@solumy/engine/app'

test.describe('App class', () => {
  test('empty config should return errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    expect(app.errors).toBeInstanceOf(Array)
    expect(app.errors).toHaveLength(3)

    const nameError = app.errors.find((e) => e.message === 'NAME_REQUIRED')
    expect(nameError).toBeDefined()
    expect(nameError).toBeInstanceOf(AppError)

    const rolesError = app.errors.find((e) => e.message === 'ROLES_REQUIRED')
    expect(rolesError).toBeDefined()
    expect(rolesError).toBeInstanceOf(AppError)

    const featuresError = app.errors.find((e) => e.message === 'FEATURES_REQUIRED')
    expect(featuresError).toBeDefined()
    expect(featuresError).toBeInstanceOf(AppError)
  })
})
