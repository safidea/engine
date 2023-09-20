import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'
import { TableMiddleware } from './TableMiddleware'
import { App } from '@entities/app/App'

describe('TableMiddleware', () => {
  describe('patchById', () => {
    test('should patch a request body', async () => {
      // Arrange
      const database = {
        read: jest.fn().mockResolvedValue({ id: '1' }),
        softUpdate: jest.fn(),
      }
      const app = new App(
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
      const request = { body: { id: '1', name: 'name' } }
      const tableMiddleware = new TableMiddleware(app)

      // Act
      await tableMiddleware.patchById(table)(request as any)

      // Assert
      expect(database.read).toHaveBeenCalledWith(table, 1)
      expect(database.softUpdate).toHaveBeenCalledWith(
        table,
        new RecordToUpdate(
          { id: '1', name: 'name', created_time: new Date().toISOString() },
          table,
          { name: 'name' }
        )
      )
    })
  })
})
