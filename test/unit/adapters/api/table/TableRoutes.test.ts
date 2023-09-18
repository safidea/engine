import { AppMapper } from '@adapters/api/app/AppMapper'
import { TableRoutes } from '@adapters/middlewares/TableMiddleware'
import { JsonOrm } from '@drivers/database/JsonDatabase'
import UnstyledUI from '@drivers/ui/UnstyledUI'
import { describe, test, expect, helpers } from '../../../../utils/unit/fixtures'
import { OrmSpi } from '@adapters/spi/orm/OrmSpi'
import { TableMapper } from '@adapters/api/table/mappers/TableMapper'

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
        { ui: UnstyledUI }
      )
      const orm = new JsonOrm(helpers.getDedicatedTmpFolder())
      orm.configure(TableMapper.toDtos(app.tables))
      await orm.create('tableA', {
        id: '1',
        created_time: new Date().toISOString(),
        fieldA: 'valueA',
      })

      // WHEN
      const instance = { emit: () => ({}) } as any
      const ormSpi = new OrmSpi(orm, app, instance)
      const response = await new TableRoutes(app, ormSpi, instance).patch({
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
