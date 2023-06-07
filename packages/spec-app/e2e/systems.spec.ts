import { ConfigInterface, EnvInterface } from 'shared-config'
import { test, expect } from '@playwright/test'
import App from '../src/app'

// GIVEN
// Une configuration .json qui décrit une app de gestion de facture dispaonible au port 8002
const config: ConfigInterface = {
  name: 'systems',
}
const env: EnvInterface = {
  PORT: '8002',
}

test.describe('Display a list of apps', () => {
  // Il faut que dans cette configuration, on ait défini un modèle de données où chaque facture a un nom
  config.tables = {
    apps: {
      fields: {
        name: {
          type: 'String',
        },
      },
    },
  }

  // Cette configuration permet d'afficher toutes les factures de l'application
  config.pages = {
    '/apps': {
      title: 'Apps',
      components: [
        {
          key: 'list',
          table: 'apps',
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
  const apps = [{ name: 'Facture 1' }, { name: 'Facture 2' }]
  test('should create 2 apps througt API', async ({ request }) => {
    for (const app of apps) {
      const response = await request.post('/api/table/apps', { data: app })
      expect(response.ok()).toBeTruthy()
    }
  })

  // WHEN
  // Quand je vais sur la page d'accueil "/"
  test('should navigate to the apps page', async ({ page }) => {
    await page.goto('/apps')
    await expect(page).toHaveTitle('Apps')
  })

  // THEN
  // Vérifier que la facture 1 et la facture 2 sont bien affiché dans la liste
  test('should display apps list', async ({ page }) => {
    await page.goto('/apps')
    await expect(page.locator('td')).toContainText(apps.map((i) => i.name))
  })
})

// Configuration de l'app de test
const app = new App({ config, env, filename: __filename })
test.beforeAll(async () => {
  await app.start()
})
test.afterAll(async () => {
  await app.stop()
})
test.use({
  baseURL: `http://localhost:${env.PORT}`,
})
