import { AppDto } from '@adapter/api/app/dtos/AppDto'
import { test, expect, helpers } from '../../../utils/e2e/fixtures'
import { DatabaseHelper } from '../../../utils/e2e/DatabaseHelper'
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

  test('should run the automation when an invoice is created', async () => {
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
    const app = await foundation.config(config)
    const db = new DatabaseHelper(app, foundation.getOrm())
    await foundation.start()

    // WHEN
    await db.createRecords('invoices', 1)

    // THEN
    expect(logs).toContain('Invoice created')
  })
})
