import { PageMiddleware } from '@adapter/api/middlewares/PageMiddleware'
import { AppDto } from '@application/dtos/AppDto'
import { mapDtoToApp } from '@application/mappers/AppMapper'
import { App } from '@domain/entities/App'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { describe, test, expect } from '@jest/globals'

describe('PageMiddleware', () => {
  test('should validate path exists', async () => {
    // GIVEN
    const appDto: AppDto = {
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
    }
    const app: App = mapDtoToApp(appDto, UnstyledUI)

    // WHEN
    const call = () => new PageMiddleware(app).pathExists('/')

    // THEN
    await expect(call()).resolves.not.toThrow()
  })

  test("should throw an error if path doesn't exist", async () => {
    // GIVEN
    const appDto: AppDto = {
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
    }
    const app: App = mapDtoToApp(appDto, UnstyledUI)

    // WHEN
    const call = () => new PageMiddleware(app).pathExists('/unknown')

    // THEN
    await expect(call()).rejects.toThrow('Page /unknown not found')
  })

  test('should validate a path with a dynamic parameter exist', async () => {
    // GIVEN
    const appDto: AppDto = {
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
    }
    const app: App = mapDtoToApp(appDto, UnstyledUI)

    // WHEN
    const call = () => new PageMiddleware(app).pathExists('/table/1')

    // THEN
    await expect(call()).resolves.not.toThrow()
  })
})
