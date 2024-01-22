import { test, expect } from '@playwright/test'
import { Page, PageError, type IPage } from '@solumy/engine/page'

const params = { components: [] }

test.describe('Page schema errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Page(config, params)

    // THEN
    expect(app.errors).toHaveLength(3)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const app = new Page(config, params)

    // THEN
    const error = app.errors.find((e) => e.code === 'PAGE_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(PageError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const app = new Page(config, params)

    // THEN
    const error = app.errors.find((e) => e.code === 'PAGE_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(PageError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const app = new Page(config, params)

    // THEN
    const error = app.errors.find((e) => e.code === 'PAGE_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(PageError)
    expect((error as PageError).data?.property).toBe('unknown')
  })
})

test.describe('Page config errors', () => {
  test('page component should be a defined component', async () => {
    // GIVEN
    const config: IPage = {
      name: 'home',
      path: '/',
      seo: {
        title: 'Home',
        description: 'Home page',
      },
      body: [
        {
          component: 'unknown',
          name: 'unknown',
        },
      ],
    }

    // WHEN
    const page = new Page(config, params)

    // THEN
    const error = page.errors.find((e) => e.code === 'PAGE_ERROR_COMPONENT_NOT_FOUND')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(PageError)
    expect((error as PageError).data?.component).toBe('unknown')
  })
})
