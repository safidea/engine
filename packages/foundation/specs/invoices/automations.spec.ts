import { Foundation } from '@infrastructure/foundation'
import { test, expect } from '@playwright/test'
import * as helpers from '../fixtures/helpers'
import { ConfigureApp } from '@application/usecases/ConfigureApp'
import { AppRepository } from '@adapter/spi/repositories/AppRepository'

test.describe('automations', () => {
  // As app developer, I want to be warned at build time if my automation has invalid database references (e.g. non existing table or column), in order to allow me to correct it before deploying the application
  test('Config validation fail if automation references an invalid field', async () => {
    // GIVEN
    const config = {
      tables: helpers.getTables('invoices'), // includes tables "invoices" and "invoices_items"
      automations: [
        {
          name: 'A',
          actions: [{ type: 'updateTable', fields: { fieldX: 'test' }, table: 'invoices' }],
        },
      ],
    }

    // WHEN
    // const errors = await foundation.validateConfig(config)
    const errors = []
    try {
      new AppRepository(config)
      //new ConfigureApp(appRepository, null as any).execute()
    } catch (err) {
      errors.push((err as any).message)
    }

    // THEN
    expect(errors).toContain('field X in automation A is not defined in table "invoices"')
  })
})
