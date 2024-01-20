import { test, expect } from '@playwright/test'
import { App } from '@solumy/engine/app'

test.describe('Instanciate an app', () => {
  test('with empty config', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new App(config)

    // THEN
    expect(app.errors).toEqual([
      { code: 'NAME_REQUIRED' },
      { code: 'ROLES_REQUIRED' },
      { code: 'FEATURES_REQUIRED' },
    ])
  })
})
