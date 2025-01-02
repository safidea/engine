import runner from 'bun:test'
import { testNotionIntegration } from 'test/e2e/integrations/notion.shared'
import { NotionBunIntegration } from '.'

const integration = new NotionBunIntegration({
  token: 'test',
})

await integration.connect()

await integration.addTable('table_1', 'Table 1', [
  {
    name: 'id',
    type: 'TEXT',
  },
])

await integration.addUser({
  id: '1',
  email: 'test@test.com',
  name: 'test',
  avatarUrl: 'test',
})

testNotionIntegration(
  {
    ...runner,
    env: {
      TABLE_ID: 'table_1',
    },
  },
  integration
)
