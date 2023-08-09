import { AppDto } from '@adapter/api/app/dtos/AppDto'
import { test, expect, helpers } from '../../../utils/e2e/fixtures'

test.describe('An automation that build an invoice document from a template', () => {
  test('should throw an error if the automation config is invalid', async ({ foundation }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
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

  test.skip('should run the automation when a record is created', async ({}) => {})
})
