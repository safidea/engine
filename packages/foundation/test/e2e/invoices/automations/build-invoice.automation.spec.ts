import { AppDto } from '@adapter/api/app/dtos/AppDto'
import { test, expect, helpers, Foundation } from '../../../utils/e2e/fixtures'
import { getDedicatedTmpFolder } from '../../../utils/helpers'

test.describe('An automation that build an invoice document from a template', () => {
  test('should throw an error if the automation config is invalid', async () => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_created',
            table: 'invoices',
          },
          actions: [
            {
              type: 'update_record',
              fields: {
                fieldX: 'test',
              },
              table: 'invalid',
            },
          ],
        },
      ],
    }
    const folder = getDedicatedTmpFolder()

    // WHEN
    const call = () => new Foundation({ folder }).config(config)

    // THEN
    expect(call).toThrow('table "invalid" in action "update_record" is not defined in tables')
  })

  test('should run the automation on startup', async ({ orm }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'log-on-startup',
          trigger: {
            event: 'server_started',
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
    const port = 50004
    const foundation = new Foundation({ adapters: { log, orm }, port })
    foundation.config(config)

    // WHEN
    await foundation.start()

    // THEN
    expect(logs).toContain('App started')
  })

  test('should run the automation when an invoice is created', async ({ request, orm }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_created',
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
    const port = 50002
    const foundation = new Foundation({ adapters: { log, orm }, port })
    await foundation.config(config).start()

    // WHEN
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

    // THEN
    expect(logs).toContain('Invoice created')
  })

  test('should run the automation when an invoice is updated', async ({ request, orm }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_updated',
            table: 'invoices',
          },
          actions: [
            {
              type: 'log',
              message: 'Invoice updated',
            },
          ],
        },
      ],
    }
    const {
      invoices: [invoice],
    } = await helpers.generateRecords(orm, 'invoices', 1)
    const logs: string[] = []
    const log = (message: string) => logs.push(message)
    const port = 50005
    const foundation = new Foundation({ adapters: { log, orm }, port })
    await foundation.config(config).start()

    // WHEN
    await request.patch(helpers.getUrl(port, `/api/table/invoices/${invoice.id}`), {
      data: {
        customer: invoice.customer + ' updated',
      },
    })

    // THEN
    expect(logs).toContain('Invoice updated')
  })

  test('should not run the action if the trigger did not happen', async () => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_created',
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
    const port = 50003
    const foundation = new Foundation({ adapters: { log }, folder, port })
    await foundation.config(config).start()

    // WHEN
    // We do nothing

    // THEN
    expect(logs).not.toContain('Invoice created')
  })
})
