import { test, expect } from '@test/fixtures'
import { integration } from '@test/integrations/notion'

test('should retrieve all the users of a workspace', async () => {
  // WHEN
  const users = await integration.listAllUsers()

  // THEN
  expect(users.length > 0).toBeTruthy()
})
