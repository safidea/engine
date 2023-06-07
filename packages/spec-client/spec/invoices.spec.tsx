import { ConfigSchemaInterface } from 'server-common'
import { render, screen, act } from '@testing-library/react'
import { DatabaseDataType } from 'shared-database'
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
  const app = new App({ config })

  // On fournit 2 factures d'exemple
  const invoices: DatabaseDataType[] = [{ name: 'Facture 1' }, { name: 'Facture 2' }]
  it('should create 2 invoices througt API', async () => {
    app.seed('invoices', invoices)
  })

  // WHEN
  // Quand je vais sur la page d'accueil "/"
  it('should navigate to the home page', async () => {
    await act(async () => {
      render(app.page('/'))
    })
  })

  // THEN
  // Vérifier que la facture 1 et la facture 2 sont bien affiché dans la liste
  it('should display invoices list', async () => {
    await act(async () => {
      render(app.page('/'))
    })
    const rows = screen.getAllByText(/Facture \d/)
    expect(rows).toHaveLength(invoices.length)
    for (let i = 0; i < rows.length; i++) {
      expect(rows[i]).toHaveTextContent(String(invoices[i].name))
    }
  })
})
