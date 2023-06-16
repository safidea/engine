import { test, expect } from '@playwright/test'
import App from '../src/app/e2e.app'
import getInvoicesConfig from '../src/configs/invoices.config'

test.describe('An api build with Next.js and Prisma', () => {
  // GIVEN
  // Une configuration .json qui décrit une app de gestion de facture
  const config = getInvoicesConfig({ name: 'prisma_invoices' })

  // Configuration de l'app de test
  const app = new App({ config, env: { PORT: '9002', DATABASE_PORT: '5434' } })
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

  test('should create a list of rows', async ({ request }) => {
    // GIVEN
    // On fournit 2 factures d'exemple
    const invoices = [
      { name: 'Facture 1', amount: 1000 },
      { name: 'Facture 2', amount: 2000 },
    ]

    // WHEN
    // Quand je vais sur la page d'accueil "/"
    const rows = await request
      .post('/api/table/invoices', { data: invoices })
      .then((res) => res.json())

    // THEN
    // Vérifier que la facture 1 et la facture 2 ont bien été créées
    for (let i = 0; i > rows.length; i++) {
      expect(rows[i].id).toBeDefined()
      expect(rows[i].created_at).toBeDefined()
      expect(rows[i].name).toEqual(invoices[i].name)
    }
  })

  test('should read a list of rows', async ({ request }) => {
    // GIVEN
    // On fournit 2 factures d'exemple
    const invoices = [
      { name: 'Facture 1', amount: 1000 },
      { name: 'Facture 2', amount: 2000 },
    ]
    await request.post('/api/table/invoices', { data: invoices })

    // WHEN
    // Quandje récupère la liste des factures
    const rows = await request.get('/api/table/invoices').then((res) => res.json())

    // THEN
    // Vérifier que la facture 1 et la facture 2 sont bien affiché dans la liste
    expect(rows.length).toEqual(2)
    expect(rows[0].name).toEqual(invoices[0].name)
    expect(rows[1].name).toEqual(invoices[1].name)
  })

  test('should update a row', async ({ request }) => {
    // GIVEN
    // On fournit 1 facture d'exemple
    const invoice = { name: 'Facture 1', amount: 1000 }
    const row = await request
      .post('/api/table/invoices', { data: invoice })
      .then((res) => res.json())

    // WHEN
    // Quand je met à jour une ligne
    const updatedRow = await request
      .patch(`/api/table/invoices/${row.id}`, { data: { name: 'Facture 2' } })
      .then((res) => res.json())

    // THEN
    // Vérifier que la facture a bien été mise à jour
    expect(updatedRow.id).toEqual(row.id)
    expect(updatedRow.name).toEqual('Facture 2')
  })

  test('should delete a row', async ({ request }) => {
    // GIVEN
    // On fournit 1 facture d'exemple
    const invoice = { name: 'Facture 1', amount: 1000 }
    const row = await request
      .post('/api/table/invoices', { data: invoice })
      .then((res) => res.json())

    // WHEN
    // Quand je supprime une ligne
    const deletedRow = await request
      .delete(`/api/table/invoices/${row.id}`)
      .then((res) => res.json())

    // THEN
    // Vérifier que la facture a bien été supprimée
    expect(deletedRow.id).toEqual(row.id)
    expect(deletedRow.deleted_at).toBeDefined()
  })
})
