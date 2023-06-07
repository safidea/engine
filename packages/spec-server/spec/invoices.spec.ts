import { ConfigSchemaInterface } from 'server-common'
import App from '../src/app'

// GIVEN
// Une configuration .json qui décrit une app de gestion de facture
const config: ConfigSchemaInterface = {
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
  const app = new App({ config, filename: __filename })
  beforeAll(async () => {
    await app.start()
  })

  // On fournit 2 factures d'exemple
  const invoices = [{ name: 'Facture 1' }, { name: 'Facture 2' }]
  it('should create 2 invoices', async () => {
    app.seed('invoices', invoices)
  })

  // WHEN
  // Quand je vais sur la page d'accueil "/"

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
