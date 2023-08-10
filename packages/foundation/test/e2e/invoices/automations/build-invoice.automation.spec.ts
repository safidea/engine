import { AppDto } from '@adapter/api/app/dtos/AppDto'
import { test, expect, helpers } from '../../../utils/e2e/fixtures'
import { getDedicatedTmpFolder } from '../../../utils/helpers/tmp'
import Foundation from '../../../../src/Foundation'

test.describe('An automation that build an invoice document from a template', () => {
  test('should throw an error if the automation config is invalid', async ({ foundation }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'recordCreated',
            table: 'invoices',
          },
          actions: [
            {
              type: 'updateTable',
              fields: {
                fieldX: 'test',
              },
              table: 'invalid',
            },
          ],
        },
      ],
    }

    // WHEN
    const call = () => foundation.config(config)

    // THEN
    await expect(call()).rejects.toThrow(
      'table "invalid" in automation "build-invoice" is not defined in tables'
    )
  })

  test('should run the automation on startup', async () => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'log-on-startup',
          trigger: {
            event: 'on_startup',
          },
          actions: [
            {
              type: 'log',
              message: 'App started',
            },
          ],
        },
      ],
    }
    const logs: string[] = []
    const log = (message: string) => logs.push(message)
    const folder = getDedicatedTmpFolder()
    const foundation = new Foundation({ log, folder })
    await foundation.config(config)

    // WHEN
    await foundation.start()

    // THEN
    expect(logs).toContain('App started')
  })

  test('should run the automation when an invoice is created', async ({ request }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'recordCreated',
            table: 'invoices',
          },
          actions: [
            {
              type: 'log',
              message: 'Invoice created',
            },
          ],
        },
      ],
    }
    const {
      invoices: [invoice],
    } = helpers.generateRecordsDto('invoices', 1)
    const logs: string[] = []
    const log = (message: string) => logs.push(message)
    const folder = getDedicatedTmpFolder()
    const foundation = new Foundation({ log, folder })
    await foundation.config(config)
    const { url } = await foundation.start()

    // WHEN
    await request.post(url + '/api/table/invoices', { data: invoice })

    // THEN
    expect(logs).toContain('Invoice created')
  })

  test('should not run the action if the trigger did not happen', async () => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'recordCreated',
            table: 'invoices',
          },
          actions: [
            {
              type: 'log',
              message: 'Invoice created',
            },
          ],
        },
      ],
    }
    const logs: string[] = []
    const log = (message: string) => logs.push(message)
    const folder = getDedicatedTmpFolder()
    const foundation = new Foundation({ log, folder })
    await foundation.config(config)
    await foundation.start()

    // WHEN
    // We do nothing

    // THEN
    expect(logs).not.toContain('Invoice created')
  })
})
