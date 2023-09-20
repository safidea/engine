import { TableMiddleware } from './TableMiddleware'
import { AppMapper } from '@adapters/mappers/app/AppMapper'

describe('TableMiddleware', () => {
  describe('patchById', () => {
    test('should patch a request body', async () => {
      // Arrange
      const database = {
        read: jest.fn().mockResolvedValue({ id: '1', name: 'name' }),
        update: jest.fn(),
      }
      const app = AppMapper.toServerApp(
        {
          tables: [
            {
              name: 'table',
              fields: [
                {
                  name: 'name',
                  type: 'single_line_text',
                },
              ],
            },
          ],
        },
        {
          database,
          storage: {} as any,
          ui: {} as any,
          fetcher: {} as any,
          templater: {} as any,
          converter: {} as any,
          logger: {} as any,
        } as any
      )
      const table = app.tables.getByName('table') as any
      const request = { body: { name: 'name' }, params: { id: '1' } }
      const tableMiddleware = new TableMiddleware(app)

      // Act
      await tableMiddleware.patchById(table)(request as any)

      // Assert
      expect(database.read).toHaveBeenCalledWith(table.name, '1')
      expect(database.update).toHaveBeenCalledWith(table.name, {
        name: 'name',
        id: '1',
        last_modified_time: expect.any(String),
      })
    })
  })
})
