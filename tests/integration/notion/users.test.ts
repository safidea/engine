import { test, expect } from '@tests/fixtures'
import { integration } from '@tests/integrations/notion'

test.describe('Notion users integration', () => {
  test('should retrieve all the users of a workspace', async () => {
    // WHEN
    const users = await integration.listAllUsers()

    // THEN
    expect(users.length > 0).toBeTruthy()
  })
})
