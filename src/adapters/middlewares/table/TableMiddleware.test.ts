import { describe, test, expect, mock } from 'bun:test'
import { TableMiddleware } from './TableMiddleware'
import { AppMapper } from '@adapters/mappers/app/AppMapper'

describe('TableMiddleware', () => {
  describe('patchById', () => {
    test('should patch a request body', async () => {
      // Arrange
      const database = {
        read: mock(() => ({ id: '1', name: 'name' })),
        update: mock(() => ({})),
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
      const readCall: any = database.read.mock.calls[0]
      expect(readCall[0]).toBe(table.name)
      expect(readCall[1]).toBe('1')
      const databaseCall: any = database.update.mock.calls[0]
      expect(databaseCall[0]).toBe(table.name)
      expect(databaseCall[1].id).toBe('1')
    })
  })
})
