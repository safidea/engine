import { AppMapper } from '@adapter/api/app/AppMapper'
import { TableRoutes } from '@adapter/api/table/TableRoutes'
import { JsonOrm } from '@infrastructure/orm/JsonOrm'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { describe, test, expect, helpers } from '../../../../utils/unit/fixtures'
import { OrmSpi } from '@adapter/spi/orm/OrmSpi'

describe('TableRoutes', () => {
  describe('patch', () => {
    test('should patch a request body', async () => {
      // GIVEN
      const app = AppMapper.toEntity(
        {
          tables: [
            {
              name: 'tableA',
              fields: [
                {
                  name: 'fieldA',
                  type: 'single_line_text',
                },
              ],
            },
          ],
        },
        { ui: UnstyledUI, log: console.log, storage: {} as any  }
      )
      const orm = new JsonOrm(helpers.getDedicatedTmpFolder())
      await orm.create('tableA', {
        id: '1',
        created_time: new Date().toISOString(),
        fieldA: 'valueA',
      })

      // WHEN
      const ormSpi = new OrmSpi(orm, app, { emit: () => {} } as any)
      const response = await new TableRoutes(app, ormSpi).patch({
        method: 'PATCH',
        path: '/api/table/tableA/1',
        body: {
          fieldA: 'valueA updated',
        },
        params: {
          table: 'tableA',
          id: '1',
        },
      })

      // THEN
      const [record] = await orm.list('tableA')
      expect(response).toEqual({
        json: {
          id: '1',
        },
      })
      expect(record.fieldA).toBe('valueA updated')
    })
  })
})
