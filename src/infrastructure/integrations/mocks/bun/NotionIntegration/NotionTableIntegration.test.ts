import runner from 'bun:test'
import { testNotionTableIntegration } from 'test/e2e/integrations/notionTable.shared'
import { NotionIntegration } from '.'

const integration = new NotionIntegration({
  token: 'test',
})

await integration.connect()

await integration.addTable('table_2', 'Table 2', [
  {
    name: 'name',
    type: 'TEXT',
  },
])

await integration.addTable('table_1', 'Table 1', [
  {
    name: 'name',
    type: 'TEXT',
  },
  {
    name: 'number',
    type: 'NUMERIC',
  },
  {
    name: 'boolean',
    type: 'BOOLEAN',
  },
  {
    name: 'text',
    type: 'TEXT',
  },
  {
    name: 'url',
    type: 'TEXT',
  },
  {
    name: 'email',
    type: 'TEXT',
  },
  {
    name: 'phone',
    type: 'TEXT',
  },
  {
    name: 'single_select',
    type: 'TEXT',
  },
  {
    name: 'status',
    type: 'TEXT',
  },
  {
    name: 'multi_select',
    type: 'TEXT[]',
  },
  {
    name: 'date',
    type: 'TIMESTAMP',
  },
  {
    name: 'people',
    type: 'TEXT[]',
  },
  {
    name: 'files',
    type: 'TEXT[]',
  },
  {
    name: 'relation',
    type: 'TEXT[]',
    table: 'table_2',
  },
  {
    name: 'rollup_names',
    type: 'TEXT',
    table: 'table_2',
    tableField: 'name',
    formula: "CONCAT(values, ', ')",
  },
  {
    name: 'archived',
    type: 'BOOLEAN',
  },
])

await integration.addUser({
  id: '1',
  email: 'test@test.com',
  name: 'test',
  avatarUrl: 'test',
})

testNotionTableIntegration(
  {
    ...runner,
    env: {
      TABLE_1_ID: 'table_1',
      TABLE_2_ID: 'table_2',
    },
  },
  integration
)
