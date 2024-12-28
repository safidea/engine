import { test, expect } from '@test/fixtures'
import Database from '@test/drivers/database'
import App, { type Config } from '@latechforce/engine'

Database.PostgreSQL(test, (dbConfig) => {
  test('should create a record with a rollup field as a number', async ({ request }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'items',
          fields: [
            {
              name: 'price',
              field: 'Number',
            },
            {
              name: 'quantity',
              field: 'Number',
            },
            {
              name: 'total',
              field: 'Formula',
              formula: 'price * quantity',
              output: {
                field: 'Number',
              },
            },
          ],
        },
        {
          name: 'invoices',
          fields: [
            {
              name: 'items',
              field: 'MultipleLinkedRecord',
              table: 'items',
            },
            {
              name: 'total',
              field: 'Rollup',
              multipleLinkedRecord: 'items',
              linkedRecordField: 'total',
              formula: 'SUM(values)',
              output: {
                field: 'Number',
              },
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
    await database
      .table('items', [
        { name: 'price', type: 'NUMERIC' },
        { name: 'quantity', type: 'NUMERIC' },
      ])
      .insertMany([
        { id: '1', fields: { price: 3, quantity: 5 }, created_at: new Date() },
        { id: '2', fields: { price: 5, quantity: 2 }, created_at: new Date() },
      ])

    // WHEN
    const { record } = await request
      .post(`${url}/api/table/invoices`, {
        data: { items: ['1', '2'] },
      })
      .then((res) => res.json())

    // THEN
    expect(record.fields.total).toBe(25)
  })

  test('should create a record with a rollup field as a text', async ({ request }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'members',
          fields: [
            {
              name: 'first_name',
              field: 'SingleLineText',
            },
            {
              name: 'last_name',
              field: 'SingleLineText',
            },
            {
              name: 'full_name',
              field: 'Formula',
              formula: "first_name || ' ' || last_name",
              output: {
                field: 'SingleLineText',
              },
            },
          ],
        },
        {
          name: 'teams',
          fields: [
            {
              name: 'members',
              field: 'MultipleLinkedRecord',
              table: 'members',
            },
            {
              name: 'names',
              field: 'Rollup',
              multipleLinkedRecord: 'members',
              linkedRecordField: 'full_name',
              formula: "CONCAT(values, ', ')",
              output: {
                field: 'SingleLineText',
              },
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
    await database
      .table('members', [
        { name: 'first_name', type: 'TEXT' },
        { name: 'last_name', type: 'TEXT' },
      ])
      .insertMany([
        { id: '1', fields: { first_name: 'John', last_name: 'Doe' }, created_at: new Date() },
        { id: '2', fields: { first_name: 'Jean', last_name: 'Dupont' }, created_at: new Date() },
      ])

    // WHEN
    const { record } = await request
      .post(`${url}/api/table/teams`, {
        data: { members: ['1', '2'] },
      })
      .then((res) => res.json())

    // THEN
    expect(record.fields.names).toBe('John Doe, Jean Dupont')
  })

  test('should create a record with multiple rollup fields', async ({ request }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'items',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
            {
              name: 'price',
              field: 'Number',
            },
            {
              name: 'quantity',
              field: 'Number',
            },
            {
              name: 'total',
              field: 'Formula',
              formula: 'price * quantity',
              output: {
                field: 'Number',
              },
            },
          ],
        },
        {
          name: 'invoices',
          fields: [
            {
              name: 'items',
              field: 'MultipleLinkedRecord',
              table: 'items',
            },
            {
              name: 'total',
              field: 'Rollup',
              multipleLinkedRecord: 'items',
              linkedRecordField: 'total',
              formula: 'SUM(values)',
              output: {
                field: 'Number',
              },
            },
            {
              name: 'names',
              field: 'Rollup',
              multipleLinkedRecord: 'items',
              linkedRecordField: 'name',
              formula: 'CONCAT(values)',
              output: {
                field: 'SingleLineText',
              },
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
    await database
      .table('items', [
        { name: 'price', type: 'NUMERIC' },
        { name: 'quantity', type: 'NUMERIC' },
      ])
      .insertMany([
        { id: '1', fields: { name: 'item 1', price: 3, quantity: 5 }, created_at: new Date() },
        { id: '2', fields: { name: 'item 2', price: 5, quantity: 2 }, created_at: new Date() },
      ])

    // WHEN
    const { record } = await request
      .post(`${url}/api/table/invoices`, {
        data: { items: ['1', '2'] },
      })
      .then((res) => res.json())

    // THEN
    expect(record.fields.names).toBe('item 1,item 2')
  })

  test('should migrate a table with a new rollup field', async ({ request }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'members',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
        {
          name: 'teams',
          fields: [
            {
              name: 'members',
              field: 'MultipleLinkedRecord',
              table: 'members',
            },
            {
              name: 'names',
              field: 'Rollup',
              multipleLinkedRecord: 'members',
              linkedRecordField: 'name',
              formula: "CONCAT(values, ', ')",
              output: {
                field: 'SingleLineText',
              },
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    await database.table('members').create()
    await database.table('members').insertMany([
      {
        id: '1',
        fields: { name: 'Jane' },
        created_at: new Date(),
      },
      {
        id: '2',
        fields: { name: 'John' },
        created_at: new Date(),
      },
    ])
    await database.table('teams').create()

    // WHEN
    const { url } = await app.start(config)
    const { record } = await request
      .post(url + '/api/table/teams', {
        data: { members: ['1', '2'] },
      })
      .then((res) => res.json())

    // THEN
    expect(record.fields.names).toBe('Jane, John')
  })

  test('should migrate a table with an updated rollup field', async ({ request }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'members',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
        {
          name: 'teams',
          fields: [
            {
              name: 'members',
              field: 'MultipleLinkedRecord',
              table: 'members',
            },
            {
              name: 'names',
              field: 'Rollup',
              multipleLinkedRecord: 'members',
              linkedRecordField: 'name',
              formula: "CONCAT(values, ', ')",
              output: {
                field: 'SingleLineText',
              },
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    await database.table('members').create()
    await database.table('members').insertMany([
      {
        id: '1',
        fields: { name: 'Jane' },
        created_at: new Date(),
      },
      {
        id: '2',
        fields: { name: 'John' },
        created_at: new Date(),
      },
    ])
    await database
      .table('teams', [
        {
          name: 'members',
          type: 'TEXT[]',
          table: 'members',
        },
        {
          name: 'names',
          type: 'TEXT',
        },
      ])
      .create()

    // WHEN
    const { url } = await app.start(config)
    const { record } = await request
      .post(url + '/api/table/teams', {
        data: { members: ['1', '2'] },
      })
      .then((res) => res.json())

    // THEN
    expect(record.fields.names).toBe('Jane, John')
  })

  test('should migrate an existing table with multiple rollup fields', async ({ request }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'items',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
            {
              name: 'price',
              field: 'Number',
            },
            {
              name: 'quantity',
              field: 'Number',
            },
            {
              name: 'total',
              field: 'Formula',
              formula: 'price * quantity',
              output: {
                field: 'Number',
              },
            },
            {
              name: 'total_vat',
              field: 'Formula',
              formula: 'total * 0.2',
              output: {
                field: 'Number',
              },
            },
          ],
        },
        {
          name: 'invoices',
          fields: [
            {
              name: 'items',
              field: 'MultipleLinkedRecord',
              table: 'items',
            },
            {
              name: 'total',
              field: 'Rollup',
              multipleLinkedRecord: 'items',
              linkedRecordField: 'total',
              formula: 'SUM(values)',
              output: {
                field: 'Number',
              },
            },
            {
              name: 'total_vat',
              field: 'Rollup',
              multipleLinkedRecord: 'items',
              linkedRecordField: 'total_vat',
              formula: 'SUM(values)',
              output: {
                field: 'Number',
              },
            },
            {
              name: 'names',
              field: 'Rollup',
              multipleLinkedRecord: 'items',
              linkedRecordField: 'name',
              formula: 'CONCAT(values)',
              output: {
                field: 'SingleLineText',
              },
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const items = database.table('items', [
      { name: 'price', type: 'NUMERIC' },
      { name: 'quantity', type: 'NUMERIC' },
      { name: 'total', type: 'NUMERIC', formula: 'price * quantity' },
      { name: 'total_vat', type: 'NUMERIC', formula: 'total * 0.2' },
    ])
    await items.create()
    await items.insertMany([
      { id: '1', fields: { name: 'item 1', price: 3, quantity: 5 }, created_at: new Date() },
      { id: '2', fields: { name: 'item 2', price: 5, quantity: 2 }, created_at: new Date() },
    ])
    await database
      .table('invoices', [
        { name: 'items', type: 'TEXT[]', table: 'items' },
        {
          name: 'total',
          type: 'NUMERIC',
          formula: 'SUM(values)',
          table: 'items',
          tableField: 'total',
        },
        {
          name: 'total_vat',
          type: 'NUMERIC',
          formula: 'SUM(values)',
          table: 'items',
          tableField: 'total_vat',
        },
        {
          name: 'names',
          type: 'TEXT',
          formula: 'CONCAT(values)',
          table: 'items',
          tableField: 'name',
        },
      ])
      .create()

    // WHEN
    const { url } = await app.start(config)
    const { record } = await request
      .post(url + '/api/table/invoices', {
        data: { items: ['1', '2'] },
      })
      .then((res) => res.json())

    // THEN
    expect(record.fields.total_vat).toBe(5)
  })
})
