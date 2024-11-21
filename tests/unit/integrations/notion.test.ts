import { test, expect, env } from '@tests/fixtures'
import { notion, integration } from '@tests/integrations/notion'
import { nanoid } from 'nanoid'

const { TEST_NOTION_TABLE_ID } = env

test.describe('Notion integration', () => {
  test('should create a page in a table', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)

    // WHEN
    const page = await table.create({
      name: nanoid(),
    })

    // THEN
    expect(page.id).toBeDefined()
    expect(page.created_time).toBeDefined()
  })

  test('should create a page in a table with a title property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const name = 'Hello World'

    // WHEN
    const page = await table.create({ name })

    // THEN
    expect(page.properties.name).toBe(name)
  })

  test('should create a page in a table with a number property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const number = 123

    // WHEN
    const page = await table.create({ number })

    // THEN
    expect(page.properties.number).toBe(number)
  })

  test('should create a page in a table with a number property from a string', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const number = '123'

    // WHEN
    const page = await table.create({ number })

    // THEN
    expect(page.properties.number).toBe(123)
  })

  test('should create a page in a table with a boolean property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const boolean = true

    // WHEN
    const page = await table.create({ boolean })

    // THEN
    expect(page.properties.boolean).toBe(boolean)
  })

  test('should create a page in a table with a boolean property from a string', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const boolean = 'false'

    // WHEN
    const page = await table.create({ boolean })

    // THEN
    expect(page.properties.boolean).toBe(false)
  })

  test('should create a page in a table with a text property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const text =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

    // WHEN
    const page = await table.create({ text })

    // THEN
    expect(page.properties.text).toBe(text)
  })

  test('should create a page in a table with a select property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const select = '1'

    // WHEN
    const page = await table.create({ select })

    // THEN
    expect(page.properties.select).toBe(select)
  })

  test('should create a page in a table with a multi_select property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const multi_select = ['1', '2']

    // WHEN
    const page = await table.create({ multi_select })

    // THEN
    expect(page.properties.multi_select).toStrictEqual(multi_select)
  })

  test('should create a page in a table with a date property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const date = new Date(2018, 8, 22, 15, 0, 0)

    // WHEN
    const page = await table.create({ date })

    // THEN
    expect(page.properties.date?.toString()).toBe(date.toString())
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
    const name = 'John Doe'

    // WHEN
    const page = await table.update(id, { name })

    // THEN
    expect(page.properties.name).toBe(name)
  })

  test('should update a page in a table with a number property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const { id } = await table.create({ number: 456 })
    const number = 123

    // WHEN
    const page = await table.update(id, { number })

    // THEN
    expect(page.properties.number).toBe(number)
  })

  test('should update a page in a table with a boolean property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const { id } = await table.create({ boolean: false })
    const boolean = true

    // WHEN
    const page = await table.update(id, { boolean })

    // THEN
    expect(page.properties.boolean).toBe(boolean)
  })

  test('should update a page in a table with a text property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const { id } = await table.create({
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    })
    const text =
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

    // WHEN
    const page = await table.update(id, { text })

    // THEN
    expect(page.properties.text).toBe(text)
  })

  test('should update a page in a table with a select property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const { id } = await table.create({ select: '1' })
    const select = '2'

    // WHEN
    const page = await table.update(id, { select })

    // THEN
    expect(page.properties.select).toBe(select)
  })

  test('should update a page in a table with a multi_select property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const { id } = await table.create({ multi_select: ['1', '2'] })
    const multi_select = ['3', '4']

    // WHEN
    const page = await table.update(id, { multi_select })

    // THEN
    expect(page.properties.multi_select).toStrictEqual(multi_select)
  })

  test('should update a page in a table with a date property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const { id } = await table.create({ date: new Date(2000) })
    const date = new Date(2018, 8, 22, 15, 0, 0)

    // WHEN
    const page = await table.update(id, { date })

    // THEN
    expect(page.properties.date?.toString()).toBe(date.toString())
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
    test.slow()

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
