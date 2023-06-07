import { ConfigInterface } from 'shared-config'
import { waitFor, render, screen, act } from '@testing-library/react'
import { DatabaseDataType } from 'shared-database'
import App from '../src/app'

describe('Display a list of invoices', () => {
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

  // WHEN
  // Quand je vais sur la page d'accueil "/"
  beforeEach(async () => {
    await app.seed('invoices', invoices)
    await act(async () => {
      render(app.page('/'))
    })
  })

  // THEN
  // Vérifier que la facture 1 et la facture 2 sont bien affiché dans la liste
  it('should display invoices list', async () => {
    const rows = screen.getAllByText(/Facture \d/)
    expect(rows).toHaveLength(invoices.length)
    for (let i = 0; i < rows.length; i++) {
      expect(rows[i]).toHaveTextContent(String(invoices[i].name))
    }
  })
})

describe('Display a list of invoices grouped by status and sorted by date', () => {
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
          values: ['draft', 'created', 'sent', 'paid'],
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
    { name: 'Facture 1', amount: 100, finalised_date: '2021-06-03', status: 'draft' },
    { name: 'Facture 2', amount: 200, finalised_date: '2021-06-04', status: 'draft' },
    { name: 'Facture 3', amount: 300, finalised_date: '2021-06-05', status: 'draft' },
    { name: 'Facture 4', amount: 400, finalised_date: '2021-05-04', status: 'finalised' },
    { name: 'Facture 5', amount: 500, finalised_date: '2021-05-03', status: 'finalised' },
    { name: 'Facture 6', amount: 600, finalised_date: '2021-04-06', status: 'sent' },
    { name: 'Facture 7', amount: 700, finalised_date: '2021-04-09', status: 'sent' },
    { name: 'Facture 8', amount: 800, finalised_date: '2021-04-08', status: 'paid' },
  ]

  // WHEN
  // Quand je vais sur la page d'accueil "/"
  beforeEach(async () => {
    await app.seed('invoices', invoices)
    await act(async () => {
      render(app.page('/'))
    })
    await waitFor(() => {
      expect(screen.getByText('Facture 8')).toBeInTheDocument()
    })
  })

  // THEN
  // Vérifier que les factures sont bien affichées dans la liste
  it('should display invoices list', async () => {
    const draftRows = screen.getAllByText(/Brouillon/)
    expect(draftRows).toHaveLength(3)

    const finalisedRows = screen.getAllByText(/Finalisée/)
    expect(finalisedRows).toHaveLength(2)

    const sentRows = screen.getAllByText(/Envoyée/)
    expect(sentRows).toHaveLength(2)

    const paidRows = screen.getAllByText(/Payée/)
    expect(paidRows).toHaveLength(1)
  })

  // Vérifier que les factures sont bien triées par date
  it('should sort invoices by finalised date then created date', async () => {
    const rows = screen.getAllByText(/Facture \d/)
    expect(rows[0]).toHaveTextContent('Facture 3')
    expect(rows[1]).toHaveTextContent('Facture 2')
    expect(rows[2]).toHaveTextContent('Facture 1')
    expect(rows[3]).toHaveTextContent('Facture 4')
    expect(rows[4]).toHaveTextContent('Facture 5')
    expect(rows[5]).toHaveTextContent('Facture 7')
    expect(rows[6]).toHaveTextContent('Facture 8')
    expect(rows[7]).toHaveTextContent('Facture 6')
  })
})
