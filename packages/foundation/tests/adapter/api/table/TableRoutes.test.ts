import { AppMapper } from '@adapter/api/app/mappers/AppMapper'
import { TableRoutes } from '@adapter/api/table/TableRoutes'
import { InMemoryOrm } from '@infrastructure/orm/InMemoryOrm'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { describe, test, expect, helpers } from '../../../fixtures'

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
        UnstyledUI
      )
      const orm = new InMemoryOrm(helpers.getTmpFolder())
      await orm.create('tableA', {
        id: '1',
        fieldA: 'valueA',
      })

      // WHEN
      const response = await new TableRoutes(app, orm).patch({
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
