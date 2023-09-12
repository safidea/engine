import { PageMiddleware } from '@adapters/validators/PageMiddleware'
import { AppMapper } from '@adapters/api/app/AppMapper'
import UnstyledUI from '@drivers/ui/UnstyledUI'
import { describe, test, expect } from '@jest/globals'

describe('PageMiddleware', () => {
  test('should validate path exists', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        pages: [
          {
            path: '/',
            components: [
              {
                type: 'title',
                text: 'Home',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )

    // WHEN
    const call = () => new PageMiddleware(app).pageExists('/')

    // THEN
    await expect(call()).resolves.not.toThrow()
  })

  test("should throw an error if path doesn't exist", async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        pages: [
          {
            path: '/',
            components: [
              {
                type: 'title',
                text: 'Home',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )

    // WHEN
    const call = () => new PageMiddleware(app).pageExists('/unknown')

    // THEN
    await expect(call()).rejects.toThrow('Page /unknown not found')
  })

  test('should validate a path with a dynamic parameter exist', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        pages: [
          {
            path: '/table/:id',
            components: [
              {
                type: 'title',
                text: 'Home',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )

    // WHEN
    const call = () => new PageMiddleware(app).pageExists('/table/1')

    // THEN
    await expect(call()).resolves.not.toThrow()
  })
})
