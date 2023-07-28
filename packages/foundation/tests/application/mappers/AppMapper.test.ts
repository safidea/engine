import { describe, test, expect } from '@jest/globals'
import * as helpers from '../../../specs/fixtures/helpers'
import { mapDtoToApp } from '@application/mappers/AppMapper'
import { AppDto } from '@application/dtos/AppDto'

// TODO : Move unit test in tests folder
describe('automations', () => {
  // As app developer, I want to be warned at build time if my automation has invalid database references (e.g. non existing table or column), in order to allow me to correct it before deploying the application
  test('Config validation fail if automation references an invalid field', async () => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTables('invoices'), // includes tables "invoices" and "invoices_items"
      automations: [
        {
          name: 'A',
          actions: [{ type: 'updateTable', fields: { fieldX: 'test' }, table: 'invoices' }],
        },
      ],
    }

    // WHEN
    const call = () => mapDtoToApp(config, null as any)

    // THEN
    expect(call).toThrow('fieldX in automation A is not defined in table "invoices"')
  })

  test('Config validation fail if automation references an invalid table', async () => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTables('invoices'), // includes tables "invoices" and "invoices_items"
      automations: [
        {
          name: 'A',
          actions: [{ type: 'updateTable', fields: {}, table: 'tableX' }],
        },
      ],
    }

    // WHEN
    const call = () => mapDtoToApp(config, null as any)

    // THEN
    expect(call).toThrow('table tableX in automation A is not defined in tables')
  })

  test('Config validation fail if automation references an invalid field and a valid field', async () => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTables('invoices'), // includes tables "invoices" and "invoices_items"
      automations: [
        {
          name: 'A',
          actions: [
            {
              type: 'updateTable',
              fields: { customer: 'Essentiel', fieldY: 'test' },
              table: 'invoices',
            },
          ],
        },
      ],
    }

    // WHEN
    const call = () => mapDtoToApp(config, null as any)

    // THEN
    expect(call).toThrow('fieldY in automation A is not defined in table "invoices"')
  })
})
