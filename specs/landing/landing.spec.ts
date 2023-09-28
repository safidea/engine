import { test, expect, helpers, Engine } from '@test/e2e/fixtures'
import LANDING_CONFIG from '@examples/landing/config'

test.describe('Landing page', () => {
  test('has title', async ({ page }) => {
    // GIVEN
    const port = 50900
    await new Engine({ port }).start(LANDING_CONFIG)
    const title = LANDING_CONFIG.pages?.[0].title as string

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(page).toHaveTitle(title)
  })

  test('has hero', async ({ page }) => {
    // GIVEN
    const port = 50901
    await new Engine({ port }).start(LANDING_CONFIG)

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(
      page.locator(
        `text=Solumy Requests is a platform for managing requests. It allows you to create, view, and manage requests.`
      )
    ).toBeVisible()
    await expect(page.locator(`text=New Request`)).toBeVisible()
    await expect(page.locator(`text=View Requests`)).toBeVisible()
    await expect(page.locator(`img[alt="Requests"]`)).toBeVisible()
    await expect(page.locator(`img[alt="Hero"]`)).toBeVisible()
  })

  test.skip('has logos', async ({ page }) => {
    // GIVEN
    const port = 50902
    await new Engine({ port }).start(LANDING_CONFIG)
    const logos = LANDING_CONFIG.pages?.[0].components[1] as any

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(page.locator(`text=${logos.title}`)).toBeVisible()
    for (const logo of logos.logos) {
      await expect(page.locator(`img[alt="${logo.alt}"]`)).toBeVisible()
    }
  })

  test.skip('has first features set', async ({ page }) => {
    // GIVEN
    const port = 50903
    await new Engine({ port }).start(LANDING_CONFIG)
    const features = LANDING_CONFIG.pages?.[0].components[2] as any

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(page.locator(`text=${features.title}`)).toBeVisible()
    for (const feature of features.features) {
      await expect(page.locator(`text=${feature.title}`)).toBeVisible()
      await expect(page.locator(`text=${feature.description}`)).toBeVisible()
      await expect(page.locator(`img[alt="${feature.image.alt}"]`)).toBeVisible()
    }
  })

  test.skip('has second features set', async ({ page }) => {
    // GIVEN
    const port = 50904
    await new Engine({ port }).start(LANDING_CONFIG)
    const features = LANDING_CONFIG.pages?.[0].components[3] as any

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(page.locator(`text=${features.title}`)).toBeVisible()
    for (const feature of features.features) {
      await expect(page.locator(`text=${feature.title}`)).toBeVisible()
      await expect(page.locator(`text=${feature.description}`)).toBeVisible()
      await expect(page.locator(`img[alt="${feature.image.alt}"]`)).toBeVisible()
    }
  })

  test.skip('has third features set', async ({ page }) => {
    // GIVEN
    const port = 50905
    await new Engine({ port }).start(LANDING_CONFIG)
    const features = LANDING_CONFIG.pages?.[0].components[4] as any

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(page.locator(`text=${features.title}`)).toBeVisible()
    for (const feature of features.features) {
      await expect(page.locator(`text=${feature.title}`)).toBeVisible()
      await expect(page.locator(`text=${feature.description}`)).toBeVisible()
      await expect(page.locator(`img[alt="${feature.image.alt}"]`)).toBeVisible()
    }
  })

  test.skip('has testimonials', async ({ page }) => {
    // GIVEN
    const port = 50906
    await new Engine({ port }).start(LANDING_CONFIG)
    const testimonials = LANDING_CONFIG.pages?.[0].components[5] as any

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(page.locator(`text=${testimonials.title}`)).toBeVisible()
    await expect(page.locator(`text=${testimonials.tagline}`)).toBeVisible()
    for (const testimonial of testimonials.testimonials) {
      await expect(page.locator(`text=${testimonial.name}`)).toBeVisible()
      await expect(page.locator(`text=${testimonial.title}`)).toBeVisible()
      await expect(page.locator(`img[alt="${testimonial.image.alt}"]`)).toBeVisible()
      await expect(page.locator(`text=${testimonial.quote}`)).toBeVisible()
    }
  })

  test.skip('has faq', async ({ page }) => {
    // GIVEN
    const port = 50907
    await new Engine({ port }).start(LANDING_CONFIG)
    const faq = LANDING_CONFIG.pages?.[0].components[6] as any

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(page.locator(`text=${faq.title}`)).toBeVisible()
    for (const question of faq.questions) {
      await expect(page.locator(`text=${question.question}`)).toBeVisible()
      await expect(page.locator(`text=${question.answer}`)).toBeVisible()
    }
  })

  test.skip('has cta', async ({ page }) => {
    // GIVEN
    const port = 50908
    await new Engine({ port }).start(LANDING_CONFIG)
    const cta = LANDING_CONFIG.pages?.[0].components[7] as any

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(page.locator(`text=${cta.title}`)).toBeVisible()
    await expect(page.locator(`text=${cta.subtitle}`)).toBeVisible()
    await expect(page.locator(`text=${cta.primaryButton.label}`)).toBeVisible()
    await expect(page.locator(`text=${cta.secondaryButton.label}`)).toBeVisible()
    await expect(page.locator(`text=${cta.image.alt}`)).toBeVisible()
  })

  test.skip('has footer', async ({ page }) => {
    // GIVEN
    const port = 50909
    await new Engine({ port }).start(LANDING_CONFIG)
    const footer = LANDING_CONFIG.pages?.[0].components[8] as any

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    for (const link of footer.navigation) {
      await expect(page.locator(`text=${link.label}`)).toBeVisible()
    }
  })
})
