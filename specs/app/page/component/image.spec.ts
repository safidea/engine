import { test, expect, helpers, drivers } from '@test/e2e/fixtures'

test.describe('Image component', () => {
  for (const ui of drivers.ui) {
    test.describe(ui.name, () => {
      test('should have width property by default', async ({ page }) => {
        // GIVEN
        const app = await helpers.startApp(
          {
            pages: [
              {
                path: '/',
                title: 'Home',
                components: [
                  {
                    type: 'image',
                    path: 'https://picsum.photos/400',
                    text: 'Image',
                  },
                ],
              },
            ],
          },
          {
            ui: ui.value as any,
          }
        )

        // WHEN
        await page.goto(helpers.getUrl(app.port, '/'))

        // THEN
        const imageWidth = await page.getByRole('img').getAttribute('width')
        expect(imageWidth).toEqual('50')
      })

      test('should display an image from the app/public directory', async ({ page, request }) => {
        // GIVEN
        const app = await helpers.startApp(
          {
            pages: [
              {
                path: '/',
                title: 'Home',
                components: [
                  {
                    type: 'image',
                    path: '/image.png',
                    text: 'Image',
                  },
                ],
              },
            ],
          },
          {
            ui: ui.value as any,
          }
        )
        helpers.copyAppFile('test/e2e', 'public/image.png', app.folder)

        // WHEN
        await page.goto(helpers.getUrl(app.port, '/'))

        // THEN
        const url = (await page.getByRole('img').getAttribute('src')) ?? ''
        const res = await request.get(helpers.getUrl(app.port, url))
        expect(res.status()).toEqual(200)
      })

      test('should be displayed with full width', async ({ page }) => {
        // GIVEN
        const app = await helpers.startApp(
          {
            pages: [
              {
                path: '/',
                title: 'Home',
                components: [
                  {
                    type: 'image',
                    path: '/image.png',
                    text: 'Image',
                    width: '100%',
                  },
                ],
              },
            ],
          },
          {
            ui: ui.value as any,
          }
        )
        helpers.copyAppFile('test/e2e', 'public/image.png', app.folder)

        // WHEN
        await page.goto(helpers.getUrl(app.port, '/'))

        // THEN
        const imageWidth = await page.getByRole('img').getAttribute('width')
        expect(imageWidth).toEqual('100%')
      })
    })
  }
})
