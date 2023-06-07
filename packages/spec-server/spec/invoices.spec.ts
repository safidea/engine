import App from '../src/app'

import type { ConfigInterface } from 'shared-config'
import type { DatabaseDataType } from 'shared-database'

// GIVEN
// Une configuration .json qui décrit une app de gestion de facture
const config: ConfigInterface = {
  name: 'invoices',
}

describe('Display a list of invoices', () => {
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
  const app = new App({ config, env: { PORT: '8000' }, filename: __filename })

  // On fournit 2 factures d'exemple
  const invoices: DatabaseDataType[] = [{ name: 'Facture 1' }, { name: 'Facture 2' }]

  // WHEN
  // Quand je vais sur la page d'accueil "/"
  beforeAll(async () => {
    await app.start()
    await app.seed('invoices', invoices)
  })

  // THEN
  // Vérifier que la facture 1 et la facture 2 sont bien affiché dans la liste
  it('should get 2 invoices from API', async () => {
    const response = await app.get('/api/table/invoices')
    expect(response.status).toBe(200)
    const rows = await response.json()
    expect(rows).toHaveLength(invoices.length)
    for (let i = 0; i < rows.length; i++) {
      expect(rows[i].name).toBe(invoices[i].name)
    }
  })
})

describe('Display a list of invoices with status and dates', () => {
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
  const app = new App({ config, env: { PORT: '8001' }, filename: __filename })

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

  // WHEN
  // Quand je vais sur la page d'accueil "/"
  beforeEach(async () => {
    await app.start()
    await app.seed('invoices', invoices)
  })

  // THEN
  // Vérifier que les factures sont bien affichées dans un groupe par statut
  it('should get 8 invoices from API', async () => {
    const response = await app.get('/api/table/invoices')
    expect(response.status).toBe(200)
    const rows = await response.json()
    expect(rows).toHaveLength(invoices.length)
    expect(rows[0].status).toBe('draft')
    expect(rows[1].status).toBe('finalised')
    expect(rows[2].status).toBe('sent')
    expect(rows[3].status).toBe('finalised')
    expect(rows[4].status).toBe('draft')
    expect(rows[5].status).toBe('paid')
    expect(rows[6].status).toBe('draft')
    expect(rows[7].status).toBe('sent')
  })
})
