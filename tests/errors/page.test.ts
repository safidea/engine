import { test, expect } from '@playwright/test'
import { createPage, PageError, type IPage } from '@solumy/engine/page'

const params = { components: [] }

test.describe('Page schema errors', () => {
  test('empty config should return 1 errors', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const { errors } = createPage(config, params)

    // THEN
    expect(errors).toHaveLength(3)
  })

  test('name should be required', async () => {
    // GIVEN
    const config = {}

    // WHEN
    const { errors } = createPage(config, params)

    // THEN
    const error = errors?.find((e) => e.code === 'PAGE_ERROR_NAME_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(PageError)
  })

  test('name should be a string', async () => {
    // GIVEN
    const config = {
      name: 1,
    }

    // WHEN
    const { errors } = createPage(config, params)

    // THEN
    const error = errors?.find((e) => e.code === 'PAGE_ERROR_NAME_STRING_TYPE_REQUIRED')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(PageError)
  })

  test('unknown property should not be allowed', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const { errors } = createPage(config, params)

    // THEN
    const error = errors?.find((e) => e.code === 'PAGE_ERROR_UNKNOWN_PROPERTY')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(PageError)
    if (!error) return
    const data = error.data
    expect(data).toBeDefined()
    expect(data).toHaveProperty('property')
    if (data && 'property' in data) expect(data.property).toBe('unknown')
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
    const { errors } = createPage(config, params)

    // THEN
    const error = errors?.find((e) => e.code === 'PAGE_ERROR_COMPONENT_NOT_FOUND')
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(PageError)
    if (!error) return
    const data = error.data
    expect(data).toBeDefined()
    expect(data).toHaveProperty('component')
    if (data && 'component' in data) expect(data.component).toBe('unknown')
  })
})
