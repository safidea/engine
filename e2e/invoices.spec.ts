import { ConfigSchemaInterface, EnvInterface } from '../packages/server-common/src'
import { test, expect } from '@playwright/test'
import App from './app'

// GIVEN
// Une configuration .json qui décrit une app de gestion de facture

const env: EnvInterface = {
  PORT: '8001',
}
const config: ConfigSchemaInterface = {
  name: 'invoices',
}

// Il faut que dans cette configuration, on ait défini un modèle de données où chaque facture a un nom

config.database = {
  url: '${DATABASE_URL}',
  provider: 'postgresql',
}

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

// On fournit 2 factures d'exemple

const invoices = [{ name: 'Facture 1' }, { name: 'Facture 2' }]

test('should create 2 invoices througt API', async ({ request }) => {
  for (const invoice of invoices) {
    const response = await request.post('/api/table/invoices', { data: invoice })
    expect(response.ok()).toBeTruthy()
  }
})

test('should navigate to the home page', async ({ page }) => {
  // WHEN
  // Quand je vais sur la page d'accueil "/"
  await page.goto('/')

  // THEN
  // Vérifier que la facture 1 et la facture 2 sont bien affiché dans la liste
  await expect(page.locator('td')).toContainText(invoices.map((i) => i.name))
})

// Configuration de l'app de test

const app = new App({ config, env, filename: __filename })

test.use({
  baseURL: `http://localhost:${env.PORT}`,
})

test.beforeAll(async () => {
  await app.start()
})

test.afterAll(async () => {
  await app.stop()
})
