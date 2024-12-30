import { env } from '@test/fixtures'
import { nanoid } from 'nanoid'
import { parse } from 'date-fns'
import type { INotionIntegration } from '@adapter/spi/integrations/NotionSpi'
import type { TestRunner } from '@test/integrations'

const { TEST_NOTION_TABLE_1_ID, TEST_NOTION_TABLE_2_ID } = env

export function testNotionTableIntegration(
  { describe, it, expect, slow }: TestRunner,
  integration: INotionIntegration
) {
  describe('insert', () => {
    it('should insert a page in a table', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)

      // WHEN
      const page = await table.insert({
        name: nanoid(),
      })

      // THEN
      expect(page.id).toBeDefined()
    })

    it('should insert a page in a table with a title property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const name = 'Hello World'

      // WHEN
      const page = await table.insert({ name })

      // THEN
      expect(page.properties.name).toBe(name)
    })

    it('should insert a page in a table with a number property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const number = 123

      // WHEN
      const page = await table.insert({ number })

      // THEN
      expect(page.properties.number).toBe(number)
    })

    it('should insert a page in a table with a number property from a string', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const number = '123'

      // WHEN
      const page = await table.insert({ number })

      // THEN
      expect(page.properties.number).toBe(123)
    })

    it('should insert a page in a table with an empty number property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)

      // WHEN
      const page = await table.insert({ number: null })

      // THEN
      expect(page.properties.number).toBeNull()
    })

    it('should insert a page in a table with a boolean property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const boolean = true

      // WHEN
      const page = await table.insert({ boolean })

      // THEN
      expect(page.properties.boolean).toBe(boolean)
    })

    it('should insert a page in a table with a boolean property from a string', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const boolean = 'false'

      // WHEN
      const page = await table.insert({ boolean })

      // THEN
      expect(page.properties.boolean).toBe(false)
    })

    it('should insert a page in a table with a text property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const text =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

      // WHEN
      const page = await table.insert({ text })

      // THEN
      expect(page.properties.text).toBe(text)
    })

    it('should insert a page in a table with an empty text property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)

      // WHEN
      const page = await table.insert({ text: null })

      // THEN
      expect(page.properties.text).toBe('')
    })

    it('should insert a page in a table with an URL property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const url = 'https://example.com'

      // WHEN
      const page = await table.insert({ url })

      // THEN
      expect(page.properties.url).toBe(url)
    })

    it('should insert a page in a table with an empty URL property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)

      // WHEN
      const page = await table.insert({ url: null })

      // THEN
      expect(page.properties.url).toBeNull()
    })

    it('should insert a page in a table with an email property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const email = 'test@test.com'

      // WHEN
      const page = await table.insert({ email })

      // THEN
      expect(page.properties.email).toBe(email)
    })

    it('should insert a page in a table with an empty email property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)

      // WHEN
      const page = await table.insert({ email: null })

      // THEN
      expect(page.properties.email).toBeNull()
    })

    it('should insert a page in a table with an phone property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const phone = '+33612345678'

      // WHEN
      const page = await table.insert({ phone })

      // THEN
      expect(page.properties.phone).toBe(phone)
    })

    it('should insert a page in a table with an empty phone property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)

      // WHEN
      const page = await table.insert({ phone: null })

      // THEN
      expect(page.properties.phone).toBeNull()
    })

    it('should insert a page in a table with a select property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const select = '1'

      // WHEN
      const page = await table.insert({ select })

      // THEN
      expect(page.properties.select).toBe(select)
    })

    it('should insert a page in a table with a status property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const status = 'En cours'

      // WHEN
      const page = await table.insert({ status })

      // THEN
      expect(page.properties.status).toBe(status)
    })

    it('should insert a page in a table with a multi_select property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const multi_select = ['1', '2']

      // WHEN
      const page = await table.insert({ multi_select })

      // THEN
      expect(page.properties.multi_select).toStrictEqual(multi_select)
    })

    it('should insert a page in a table with a date property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const date = new Date(2018, 8, 22, 15, 0, 0)

      // WHEN
      const page = await table.insert({ date })

      // THEN
      expect(page.properties.date?.toString()).toBe(date.toString())
    })

    it('should insert a page in a table with a date property from a date string', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const date = '2018-09-22'

      // WHEN
      const page = await table.insert({ date })

      // THEN
      expect(page.properties.date).toStrictEqual(parse(date, 'yyyy-MM-dd', new Date()))
    })

    it('should insert a page in a table with a date property from a date and time string', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const date = '2018-09-22T15:00:00'

      // WHEN
      const page = await table.insert({ date })

      // THEN
      expect(page.properties.date).toStrictEqual(parse(date, "yyyy-MM-dd'T'HH:mm:ss", new Date()))
    })

    it('should insert a page in a table with a date property from a date, time and milliseconds string', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const date = '2018-09-22T15:00:00.000Z'

      // WHEN
      const page = await table.insert({ date })

      // THEN
      expect(page.properties.date).toStrictEqual(
        parse(date, "yyyy-MM-dd'T'HH:mm:ss.SSSX", new Date())
      )
    })

    it('should insert a page in a table with a date property from a timestamp', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const date = new Date(2018, 8, 22)
      const timestamp = +date

      // WHEN
      const page = await table.insert({ date: timestamp })

      // THEN
      expect(page.properties.date?.toString()).toBe(date.toString())
    })

    it('should insert a page in a table with a date property and a null value', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const date = null

      // WHEN
      const page = await table.insert({ date })

      // THEN
      expect(page.properties.date).toBeNull()
    })

    it('should insert a page in a table with a people property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const [{ id }] = await integration.listAllUsers()

      // WHEN
      const page = await table.insert({ people: [id] })

      // THEN
      expect(page.properties.people).toStrictEqual([id])
    })

    it('should insert a page in a table with a files property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const files = [
        {
          name: 'John Doe',
          url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
        },
      ]

      // WHEN
      const page = await table.insert({ files })

      // THEN
      expect(page.properties.files).toStrictEqual(files)
    })
  })

  describe('retrieve', () => {
    it('should retrieve a page in a table', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const name = nanoid()
      const { id } = await table.insert({ name })

      // WHEN
      const page = await table.retrieve(id)

      // THEN
      expect(page.properties.name).toBe(name)
    })

    it('should retrieve a page in a table with a created_time', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const name = nanoid()
      const { id } = await table.insert({ name })

      // WHEN
      const page = await table.retrieve(id)

      // THEN
      expect(page.created_time).toBeDefined()
    })

    it('should retrieve a page in a table with a last_edited_time', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const name = nanoid()
      const { id } = await table.insert({ name })

      // WHEN
      const page = await table.retrieve(id)

      // THEN
      expect(page.last_edited_time).toBeDefined()
    })

    it('should retrieve an archived page in a table', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const name = nanoid()
      const { id } = await table.insert({ name })
      await table.archive(id)

      // WHEN
      const page = await table.retrieve(id)

      // THEN
      expect(page.archived).toBeTruthy()
    })
  })

  describe('update', () => {
    it('should update a page in a table with a title property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const { id } = await table.insert({ name: 'John' })
      const name = 'John Doe'

      // WHEN
      const page = await table.update(id, { name })

      // THEN
      expect(page.properties.name).toBe(name)
    })

    it('should update a page in a table with a number property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const { id } = await table.insert({ number: 456 })
      const number = 123

      // WHEN
      const page = await table.update(id, { number })

      // THEN
      expect(page.properties.number).toBe(number)
    })

    it('should update a page in a table with a boolean property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const { id } = await table.insert({ boolean: false })
      const boolean = true

      // WHEN
      const page = await table.update(id, { boolean })

      // THEN
      expect(page.properties.boolean).toBe(boolean)
    })

    it('should update a page in a table with a text property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const { id } = await table.insert({
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      })
      const text =
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

      // WHEN
      const page = await table.update(id, { text })

      // THEN
      expect(page.properties.text).toBe(text)
    })

    it('should update a page in a table with a select property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const { id } = await table.insert({ select: '1' })
      const select = '2'

      // WHEN
      const page = await table.update(id, { select })

      // THEN
      expect(page.properties.select).toBe(select)
    })

    it('should update a page in a table with a status property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const { id } = await table.insert({ status: 'En cours' })
      const status = 'Terminé'

      // WHEN
      const page = await table.update(id, { status })

      // THEN
      expect(page.properties.status).toBe(status)
    })

    it('should update a page in a table with a multi_select property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const { id } = await table.insert({ multi_select: ['1', '2'] })
      const multi_select = ['3', '4']

      // WHEN
      const page = await table.update(id, { multi_select })

      // THEN
      expect(page.properties.multi_select).toStrictEqual(multi_select)
    })

    it('should update a page in a table with a date property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const { id } = await table.insert({ date: new Date(2000) })
      const date = new Date(2018, 8, 22, 15, 0, 0)

      // WHEN
      const page = await table.update(id, { date })

      // THEN
      expect(page.properties.date?.toString()).toBe(date.toString())
    })

    it('should update a page in a table with a date property and a null value', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const { id } = await table.insert({ date: new Date(2000) })
      const date = null

      // WHEN
      const page = await table.update(id, { date })

      // THEN
      expect(page.properties.date).toBeNull()
    })

    it('should update a page in a table with a people property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const [{ id: peopleId }] = await integration.listAllUsers()
      const { id } = await table.insert({ people: [] })

      // WHEN
      const page = await table.update(id, { people: [peopleId] })

      // THEN
      expect(page.properties.people).toStrictEqual([peopleId])
    })

    it('should update a page in a table with a files property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const files = [
        {
          name: 'John Doe',
          url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
        },
      ]
      const { id } = await table.insert({ files: [] })

      // WHEN
      const page = await table.update(id, { files })

      // THEN
      expect(page.properties.files).toStrictEqual(files)
    })
  })

  describe('insertMany', () => {
    it('should insert many pages in a table with a title property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)

      // WHEN
      const ids = await table.insertMany([
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
  })

  describe('updateMany', () => {
    it('should update many pages in a table with a title property', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const pagesinsertd = await table.insertMany([
        {
          name: '1',
        },
        {
          name: '2',
        },
        {
          name: '3',
        },
      ])

      // WHEN
      const pagesUpdated = await table.updateMany(
        pagesinsertd.map((page) => ({ id: page.id, page: { name: 'John Doe' } }))
      )

      // THEN
      expect(pagesUpdated.map((p) => p.properties.name)).toStrictEqual([
        'John Doe',
        'John Doe',
        'John Doe',
      ])
    })
  })

  describe('archive', () => {
    it('should archive a page in a table', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const name = nanoid()
      const { id } = await table.insert({ name })

      // WHEN
      await table.archive(id)

      // THEN
      const page = await table.retrieve(id)
      if (!('archived' in page)) {
        throw new Error('Page properties are missing')
      }
      expect(page.archived).toBe(true)
    })
  })

  describe('list', () => {
    it('should list pages in a table', async () => {
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
      await table.insertMany(values)

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

    it('should list pages in a table with a OnOrAfter string filter', async () => {
      // GIVEN
      const now = new Date()
      now.setMinutes(now.getMinutes() - 1)
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
      await table.insertMany(values)

      // WHEN
      const pages = await table.list({
        and: [
          {
            field: 'created_time',
            operator: 'OnOrAfter',
            value: now.toISOString(),
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

    it('should throw an error if filter field does not exist', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const name = nanoid()
      const page = await table.insert({ name })

      // WHEN
      const call = () =>
        table.list({
          field: 'invalid',
          operator: 'Is',
          value: page.id,
        })

      // THEN
      await expect(call).rejects.toThrowError('Property "invalid" does not exist')
    })

    it('should list pages in a table with a Is filter on a formula', async () => {
      // GIVEN
      const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const name = nanoid()
      const page = await table.insert({ name })

      // WHEN
      const pages = await table.list({
        field: 'id',
        operator: 'Is',
        value: page.id.replace(/-/g, ''),
      })

      // THEN
      expect(pages).toHaveLength(1)
    })

    it('should list pages in a table with a Contains filter on a rollup', async () => {
      // GIVEN
      const table1 = await integration.getTable(TEST_NOTION_TABLE_1_ID)
      const table2 = await integration.getTable(TEST_NOTION_TABLE_2_ID)
      const name = nanoid()
      const pageTable2 = await table2.insert({ name })
      await table1.insert({ name: nanoid(), relation: [pageTable2.id] })

      // WHEN
      const pages = await table1.list({
        field: 'rollup_names',
        operator: 'Contains',
        value: name,
      })

      // THEN
      expect(pages).toHaveLength(1)
    })
  })

  if (slow) {
    describe('stress test', () => {
      it('should allow 100 requests in few seconds', async () => {
        slow()

        // GIVEN
        const table = await integration.getTable(TEST_NOTION_TABLE_1_ID)
        const values = Array.from({ length: 100 }, () => ({
          name: nanoid(),
        }))

        // WHEN
        const pages = await table.insertMany(values)

        // THEN
        expect(pages).toHaveLength(100)
      })
    })
  }
}
