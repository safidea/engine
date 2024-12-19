import { test, expect, env } from '@tests/fixtures'
import { notion, integration } from '@tests/integrations/notion'
import { nanoid } from 'nanoid'
import { parse } from 'date-fns'

const { TEST_NOTION_TABLE_1_ID, TEST_NOTION_TABLE_2_ID } = env

test.describe('Notion databases integration', () => {
  test('should create a page in a table', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)

    // WHEN
    const page = await table.create({
      name: nanoid(),
    })

    // THEN
    expect(page.id).toBeDefined()
  })

  test('should create a page in a table with a title property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const name = 'Hello World'

    // WHEN
    const page = await table.create({ name })

    // THEN
    expect(page.properties.name).toBe(name)
  })

  test('should create a page in a table with a number property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const number = 123

    // WHEN
    const page = await table.create({ number })

    // THEN
    expect(page.properties.number).toBe(number)
  })

  test('should create a page in a table with a number property from a string', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const number = '123'

    // WHEN
    const page = await table.create({ number })

    // THEN
    expect(page.properties.number).toBe(123)
  })

  test('should create a page in a table with a boolean property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const boolean = true

    // WHEN
    const page = await table.create({ boolean })

    // THEN
    expect(page.properties.boolean).toBe(boolean)
  })

  test('should create a page in a table with a boolean property from a string', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const boolean = 'false'

    // WHEN
    const page = await table.create({ boolean })

    // THEN
    expect(page.properties.boolean).toBe(false)
  })

  test('should create a page in a table with a text property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const text =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

    // WHEN
    const page = await table.create({ text })

    // THEN
    expect(page.properties.text).toBe(text)
  })

  test('should create a page in a table with a select property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const select = '1'

    // WHEN
    const page = await table.create({ select })

    // THEN
    expect(page.properties.select).toBe(select)
  })

  test('should create a page in a table with a status property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const status = 'En cours'

    // WHEN
    const page = await table.create({ status })

    // THEN
    expect(page.properties.status).toBe(status)
  })

  test('should create a page in a table with a multi_select property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const multi_select = ['1', '2']

    // WHEN
    const page = await table.create({ multi_select })

    // THEN
    expect(page.properties.multi_select).toStrictEqual(multi_select)
  })

  test('should create a page in a table with a date property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const date = new Date(2018, 8, 22, 15, 0, 0)

    // WHEN
    const page = await table.create({ date })

    // THEN
    expect(page.properties.date?.toString()).toBe(date.toString())
  })

  test('should create a page in a table with a date property from a string', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const date = '2018-09-22'

    // WHEN
    const page = await table.create({ date })

    // THEN
    expect(page.properties.date).toStrictEqual(parse(date, 'yyyy-MM-dd', new Date()))
  })

  test('should create a page in a table with a date property from a timestamp', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const date = new Date(2018, 8, 22)
    const timestamp = +date

    // WHEN
    const page = await table.create({ date: timestamp })

    // THEN
    expect(page.properties.date?.toString()).toBe(date.toString())
  })

  test('should create a page in a table with a date property and a null value', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const date = null

    // WHEN
    const page = await table.create({ date })

    // THEN
    expect(page.properties.date).toBeNull()
  })

  test('should create a page in a table with a people property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const [{ id }] = await integration.listAllUsers()

    // WHEN
    const page = await table.create({ people: [id] })

    // THEN
    expect(page.properties.people).toStrictEqual([id])
  })

  test('should create a page in a table with a files property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const files = [
      {
        name: 'John Doe',
        url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
      },
    ]

    // WHEN
    const page = await table.create({ files })

    // THEN
    expect(page.properties.files).toStrictEqual(files)
  })

  test('should retrieve a page in a table', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const name = nanoid()
    const { id } = await table.create({ name })

    // WHEN
    const page = await table.retrieve(id)

    // THEN
    expect(page.properties.name).toBe(name)
  })

  test('should retrieve a page in a table with a created_time', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const name = nanoid()
    const { id } = await table.create({ name })

    // WHEN
    const page = await table.retrieve(id)

    // THEN
    expect(page.created_time).toBeDefined()
  })

  test('should retrieve a page in a table with a last_edited_time', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const name = nanoid()
    const { id } = await table.create({ name })

    // WHEN
    const page = await table.retrieve(id)

    // THEN
    expect(page.last_edited_time).toBeDefined()
  })

  test('should retrieve an archived page in a table', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const name = nanoid()
    const { id } = await table.create({ name })
    await table.archive(id)

    // WHEN
    const page = await table.retrieve(id)

    // THEN
    expect(page.archived).toBeTruthy()
  })

  test('should update a page in a table with a title property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const { id } = await table.create({ name: 'John' })
    const name = 'John Doe'

    // WHEN
    const page = await table.update(id, { name })

    // THEN
    expect(page.properties.name).toBe(name)
  })

  test('should update a page in a table with a number property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const { id } = await table.create({ number: 456 })
    const number = 123

    // WHEN
    const page = await table.update(id, { number })

    // THEN
    expect(page.properties.number).toBe(number)
  })

  test('should update a page in a table with a boolean property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const { id } = await table.create({ boolean: false })
    const boolean = true

    // WHEN
    const page = await table.update(id, { boolean })

    // THEN
    expect(page.properties.boolean).toBe(boolean)
  })

  test('should update a page in a table with a text property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
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
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const { id } = await table.create({ select: '1' })
    const select = '2'

    // WHEN
    const page = await table.update(id, { select })

    // THEN
    expect(page.properties.select).toBe(select)
  })

  test('should update a page in a table with a status property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const { id } = await table.create({ status: 'En cours' })
    const status = 'Terminé'

    // WHEN
    const page = await table.update(id, { status })

    // THEN
    expect(page.properties.status).toBe(status)
  })

  test('should update a page in a table with a multi_select property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const { id } = await table.create({ multi_select: ['1', '2'] })
    const multi_select = ['3', '4']

    // WHEN
    const page = await table.update(id, { multi_select })

    // THEN
    expect(page.properties.multi_select).toStrictEqual(multi_select)
  })

  test('should update a page in a table with a date property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const { id } = await table.create({ date: new Date(2000) })
    const date = new Date(2018, 8, 22, 15, 0, 0)

    // WHEN
    const page = await table.update(id, { date })

    // THEN
    expect(page.properties.date?.toString()).toBe(date.toString())
  })

  test('should update a page in a table with a date property and a null value', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const { id } = await table.create({ date: new Date(2000) })
    const date = null

    // WHEN
    const page = await table.update(id, { date })

    // THEN
    expect(page.properties.date).toBeNull()
  })

  test('should update a page in a table with a people property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const [{ id: peopleId }] = await integration.listAllUsers()
    const { id } = await table.create({ people: [] })

    // WHEN
    const page = await table.update(id, { people: [peopleId] })

    // THEN
    expect(page.properties.people).toStrictEqual([peopleId])
  })

  test('should update a page in a table with a files property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const files = [
      {
        name: 'John Doe',
        url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
      },
    ]
    const { id } = await table.create({ files: [] })

    // WHEN
    const page = await table.update(id, { files })

    // THEN
    expect(page.properties.files).toStrictEqual(files)
  })

  test('should create many pages in a table with a title property', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)

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
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
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
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
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

  test('should list pages in a table with a IsAfterNumberOfSecondsSinceNow filter', async () => {
    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
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

  test('should list pages in a table with a Contains filter on a rollup', async () => {
    // GIVEN
    const table1 = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const table2 = await integration.getTable(TEST_NOTION_TABLE_2_ID)
    const name = nanoid()
    const pageTable2 = await table2.create({ name })
    await table1.create({ name: nanoid(), relation: [pageTable2.id] })

    // WHEN
    const pages = await table1.list({
      field: 'rollup_names',
      operator: 'Contains',
      value: name,
    })

    // THEN
    expect(pages).toHaveLength(1)
  })

  test('should allow 100 requests in few seconds', async () => {
    test.slow()

    // GIVEN
    const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
    const values = Array.from({ length: 100 }, () => ({
      name: nanoid(),
    }))

    // WHEN
    const pages = await Promise.all(values.map((value) => table.create(value)))

    // THEN
    expect(pages).toHaveLength(100)
  })
})
