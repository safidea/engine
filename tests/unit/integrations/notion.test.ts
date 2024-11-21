import { test, expect, env } from '@tests/fixtures'
import { notion, integration } from '@tests/integrations/notion'
import { nanoid } from 'nanoid'

const { TEST_NOTION_TABLE_ID } = env

test.describe('Notion integration', () => {
  test('should create a page in a table with a title property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)

    // WHEN
    const id = await table.create({ name: nanoid() })

    // THEN
    expect(id).toBeDefined()
  })

  test('should retrieve a page in a table', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const name = nanoid()
    const { id } = await table.create({ name })

    // WHEN
    const page = await table.retrieve(id)

    // THEN
    expect(page.properties.name).toBe(name)
  })

  test('should update a page in a table with a title property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const { id } = await table.create({ name: 'John' })

    // WHEN
    await table.update(id, { name: 'John Doe' })

    // THEN
    const page = await table.retrieve(id)
    expect(page.properties.name).toBe('John Doe')
  })

  test('should create many pages in a table with a title property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)

    // WHEN
    const ids = await table.createMany([
      {
        name: nanoid(),
      },
      {
        name: nanoid(),
      },
      {
        name: nanoid(),
      },
    ])

    // THEN
    expect(ids).toHaveLength(3)
  })

  test('should archive a page in a table', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const name = nanoid()
    const { id } = await table.create({ name })

    // WHEN
    await table.archive(id)

    // THEN
    const page = await notion.pages.retrieve({ page_id: id })
    if (!('archived' in page)) {
      throw new Error('Page properties are missing')
    }
    expect(page.archived).toBe(true)
  })

  test('should list pages in a table', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const values = [
      {
        name: nanoid(),
      },
      {
        name: nanoid(),
      },
      {
        name: nanoid(),
      },
    ]
    await table.createMany(values)

    // WHEN
    const pages = await table.list({
      or: values.map((value) => ({
        field: 'name',
        operator: 'Is',
        value: value.name,
      })),
    })

    // THEN
    expect(pages).toHaveLength(3)
  })

  test('should list pages in a table with a IsAfterNumberOfSecondsSinceNow', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const values = [
      {
        name: nanoid(),
      },
      {
        name: nanoid(),
      },
      {
        name: nanoid(),
      },
    ]
    await table.createMany(values)

    // WHEN
    const pages = await table.list({
      and: [
        {
          field: 'created_time',
          operator: 'IsAfterNumberOfSecondsSinceNow',
          value: 60,
        },
        {
          or: values.map((value) => ({
            field: 'name',
            operator: 'Is',
            value: value.name,
          })),
        },
      ],
    })

    // THEN
    expect(pages).toHaveLength(3)
  })

  test('should allow 100 requests in few seconds', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const values = Array.from({ length: 100 }, () => ({
      name: nanoid(),
    }))

    // WHEN
    const pages = await Promise.all(values.map((value) => table.create(value)))

    // THEN
    expect(pages).toHaveLength(100)
  })
})
