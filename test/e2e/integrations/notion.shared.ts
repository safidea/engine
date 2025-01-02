import type { INotionIntegration } from '@adapter/spi/integrations/NotionSpi'
import type { TestRunner } from '@test/runner'

export function testNotionIntegration(
  { describe, it, expect, env = {} }: TestRunner,
  integration: INotionIntegration
) {
  const { TABLE_ID } = env

  describe('getTable', () => {
    it('should get a table id without -', async () => {
      // GIVEN
      const table = await integration.getTable(TABLE_ID)

      // THEN
      expect(table.id).not.toContain('-')
    })
  })

  describe('listAllUsers', () => {
    it('should retrieve all the users of a workspace', async () => {
      // WHEN
      const users = await integration.listAllUsers()

      // THEN
      expect(users.length > 0).toBeTruthy()
    })
  })
}
