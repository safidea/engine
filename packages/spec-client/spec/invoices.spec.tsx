import { waitFor, render, screen, act } from '@testing-library/react'
import App from '../src/app'

import type { DatabaseDataType } from 'shared-database'
import type { ConfigInterface } from 'shared-config'

describe('An application that manages invoices', () => {
  it('should display a list of named invoices', async () => {
    // GIVEN
    // Une configuration .json qui décrit une app de gestion de facture
    const config: ConfigInterface = {
      name: 'invoices',
    }

    // Il faut que dans cette configuration, on ait défini un modèle de données où chaque facture a un nom
    config.tables = {
      invoices: {
        fields: {
          name: {
            type: 'String',
          },
        },
      },
    }

    // Cette configuration permet d'afficher toutes les factures de l'application
    config.pages = {
      '/': {
        title: 'Invoices',
        components: [
          {
            key: 'list',
            table: 'invoices',
            fields: [
              {
                key: 'name',
                label: 'Titre',
              },
            ],
          },
        ],
      },
    }

    // Configuration de l'app de test
    const app = new App({ config })

    // On fournit 2 factures d'exemple
    const invoices: DatabaseDataType[] = [{ name: 'Facture 1' }, { name: 'Facture 2' }]
    await app.seed('invoices', invoices)

    // WHEN
    // Quand je vais sur la page d'accueil "/"
    await act(async () => {
      render(app.page('/'))
    })

    // THEN
    // Vérifier que la facture 1 et la facture 2 sont bien affiché dans la liste
    const rows = screen.getAllByText(/Facture \d/)
    for (let i = 0; i < rows.length; i++) {
      expect(rows[i]).toHaveTextContent(String(invoices[i].name))
    }
  })

  it('should display a list of invoices grouped by status and sorted by dates', async () => {
    // GIVEN
    // Une configuration .json qui décrit une app de gestion de facture
    const config: ConfigInterface = {
      name: 'invoices',
    }

    // Il faut que dans cette configuration, on ait défini un modèle de données où chaque facture a un nom, un montant, une date de finalisation et un statut
    config.tables = {
      invoices: {
        fields: {
          name: {
            type: 'String',
          },
          amount: {
            type: 'Int',
            default: 0,
          },
          status: {
            type: 'SingleSelect',
            options: ['draft', 'finalised', 'sent', 'paid'],
            default: 'draft',
          },
          number: {
            type: 'String',
            optional: true,
          },
          finalised_date: {
            type: 'DateTime',
            optional: true,
          },
        },
      },
    }

    // Cette configuration permet d'afficher toutes les factures de l'application groupées par statut et triées par date
    config.pages = {
      '/': {
        title: 'Invoices',
        components: [
          {
            key: 'list',
            table: 'invoices',
            fields: [
              {
                key: 'name',
                label: 'Titre',
              },
              {
                key: 'amount',
                label: 'Montant',
              },
              {
                key: 'status',
                label: 'Statut',
                options: [
                  {
                    key: 'draft',
                    label: 'Brouillon',
                  },
                  {
                    key: 'finalised',
                    label: 'Finalisée',
                  },
                  {
                    key: 'sent',
                    label: 'Envoyée',
                  },
                  {
                    key: 'paid',
                    label: 'Payée',
                  },
                ],
              },
              {
                key: 'finalised_date',
                label: 'Date de finalisation',
              },
              {
                key: 'created_date',
                label: 'Date de création',
              },
            ],
            groupBy: [{ field: 'status', order: 'first_to_last' }],
            sortBy: [
              { field: 'finalised_date', order: 'desc' },
              { field: 'created_date', order: 'desc' },
            ],
          },
        ],
      },
    }

    // Configuration de l'app de test
    const app = new App({ config })

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
    await waitFor(() => {
      expect(screen.getByText('Facture 8')).toBeInTheDocument()
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
  })
})
