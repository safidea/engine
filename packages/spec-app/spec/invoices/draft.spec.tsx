import { render, act } from '@testing-library/react'
import App from '../../src/app'

import type { DatabaseDataType } from 'shared-database'
import getInvoicesConfig from '../config'

describe('A page that allow to edit draft invoices', () => {
  it('should create a new draft', async () => {
    // GIVEN
    // Une configuration .json qui décrit une app de gestion de facture
    const config = getInvoicesConfig()

    // Configuration de l'app de test
    const app = new App({ config })
    await app.start()

    // On fournit 8 factures d'exemple
    const invoices: DatabaseDataType[] = []
    await app.seed('invoices', invoices)

    // WHEN
    // Quand je vais sur la page d'accueil "/"
    await act(async () => {
      render(app.page('/'))
    })

    // THEN
    // Vérifier que les factures sont bien affichées dans un groupe par statut

    await app.stop()
  })
})
