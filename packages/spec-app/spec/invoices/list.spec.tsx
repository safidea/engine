import { render, screen, act } from '@testing-library/react'
import App from '../../src/app'

import type { DatabaseDataType } from 'shared-database'
import getInvoicesConfig from '../config'

describe('A page that list invoices', () => {
  it('should display a list of invoices grouped by status and sorted by dates', async () => {
    // GIVEN
    // Une configuration .json qui décrit une app de gestion de facture
    const config = getInvoicesConfig()

    // Configuration de l'app de test
    const app = new App({ config })
    await app.start()

    // On fournit 8 factures d'exemple
    const invoices: DatabaseDataType[] = [
      { name: 'Facture 1', amount: 100, status: 'draft' },
      {
        name: 'Facture 2',
        amount: 200,
        finalised_date: '2021-06-04',
        status: 'finalised',
        number: '1002',
      },
      {
        name: 'Facture 3',
        amount: 300,
        finalised_date: '2021-06-05',
        status: 'sent',
        number: '1003',
      },
      {
        name: 'Facture 4',
        amount: 400,
        finalised_date: '2021-05-04',
        status: 'finalised',
        number: '1004',
      },
      { name: 'Facture 5', amount: 500, status: 'draft' },
      {
        name: 'Facture 6',
        amount: 600,
        finalised_date: '2021-04-06',
        status: 'paid',
        number: '1006',
      },
      { name: 'Facture 7', amount: 700, status: 'draft' },
      {
        name: 'Facture 8',
        amount: 800,
        finalised_date: '2021-04-08',
        status: 'sent',
        number: '1008',
      },
    ]
    await app.seed('invoices', invoices)

    // WHEN
    // Quand je vais sur la page d'accueil "/"
    await act(async () => {
      render(app.page('/'))
    })

    // THEN
    // Vérifier que les factures sont bien affichées dans un groupe par statut
    const draftRows = screen.getAllByText(/Brouillon/)
    expect(draftRows).toHaveLength(4)

    const finalisedRows = screen.getAllByText(/Finalisée/)
    expect(finalisedRows).toHaveLength(3)

    const sentRows = screen.getAllByText(/Envoyée/)
    expect(sentRows).toHaveLength(3)

    const paidRows = screen.getAllByText(/Payée/)
    expect(paidRows).toHaveLength(2)

    // THEN
    // Vérifier que les factures sont bien triées par date
    const rows = screen.getAllByText(/Facture \d/)
    expect(rows[0]).toHaveTextContent('Facture 1')
    expect(rows[1]).toHaveTextContent('Facture 5')
    expect(rows[2]).toHaveTextContent('Facture 7')
    expect(rows[3]).toHaveTextContent('Facture 2')
    expect(rows[4]).toHaveTextContent('Facture 4')
    expect(rows[5]).toHaveTextContent('Facture 3')
    expect(rows[6]).toHaveTextContent('Facture 8')
    expect(rows[7]).toHaveTextContent('Facture 6')

    await app.stop()
  })

  it('should navigate to drafts page', async () => {
    // GIVEN
    // Une configuration .json qui décrit une app de gestion de facture
  })
})
