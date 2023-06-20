import { test, expect } from '@playwright/test'
import App from '../src/app/e2e.app'
import getInvoicesConfig from '../src/configs/invoices.config'

test.describe('An app build with Next.js', () => {
  // GIVEN
  // Une configuration .json qui décrit une app de gestion de facture
  const config = getInvoicesConfig({ name: 'next_invoices' })

  // Configuration de l'app de test
  const app = new App({ config, env: { PORT: '9001', DATABASE_PORT: '5433' } })
  test.beforeAll(async () => {
    await app.start()
  })
  test.afterAll(async () => {
    await app.stop()
  })
  test.use({
    baseURL: `http://localhost:${app.port}`,
  })
  test.beforeEach(async () => {
    await app.clear()
  })

  test('should display the page title', async ({ page }) => {
    // WHEN
    // Quand je vais sur la page d'accueil "/"
    await page.goto('/')

    // THEN
    // Vérifier que le titre de la page est "Invoices"
    await expect(page).toHaveTitle('All invoices')
  })

  test('should display a list of rows', async ({ page, request }) => {
    // GIVEN
    // On fournit 2 factures d'exemple
    const invoices = [
      { title: 'Invoice 1', amount: 1000 },
      { title: 'Invoice 2', amount: 2000 },
    ]
    await request.post('/api/table/invoices', { data: invoices })

    // WHEN
    // Quand je vais sur la page d'accueil "/"
    await page.goto('/')

    // THEN
    // Vérifier que la facture 1 et la facture 2 sont bien affiché dans la liste
    await expect(page.locator('td')).toContainText(invoices.map((i) => i.title))
  })
})
