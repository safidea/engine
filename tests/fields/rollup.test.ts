import { test, expect } from '@tests/fixtures'
import Database from '@tests/database'
import App, { type App as Config } from '@safidea/engine'

test.describe('Rollup field', () => {
  Database.each(test, (dbConfig) => {
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
      const url = await app.start(config)
      await database
        .table('items', [
          { name: 'price', type: 'NUMERIC' },
          { name: 'quantity', type: 'NUMERIC' },
        ])
        .insertMany([
          { id: '1', price: 3, quantity: 5, created_at: new Date() },
          { id: '2', price: 5, quantity: 2, created_at: new Date() },
        ])

      // WHEN
      const { record } = await request
        .post(`${url}/api/table/invoices`, {
          data: { items: ['1', '2'] },
        })
        .then((res) => res.json())

      // THEN
      expect(record.total).toBe(25)
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
      const url = await app.start(config)
      await database
        .table('members', [
          { name: 'first_name', type: 'TEXT' },
          { name: 'last_name', type: 'TEXT' },
        ])
        .insertMany([
          { id: '1', first_name: 'John', last_name: 'Doe', created_at: new Date() },
          { id: '2', first_name: 'Jean', last_name: 'Dupont', created_at: new Date() },
        ])

      // WHEN
      const { record } = await request
        .post(`${url}/api/table/teams`, {
          data: { members: ['1', '2'] },
        })
        .then((res) => res.json())

      // THEN
      expect(record.names).toBe('John Doe, Jean Dupont')
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
      const url = await app.start(config)
      await database
        .table('items', [
          { name: 'price', type: 'NUMERIC' },
          { name: 'quantity', type: 'NUMERIC' },
        ])
        .insertMany([
          { id: '1', name: 'item 1', price: 3, quantity: 5, created_at: new Date() },
          { id: '2', name: 'item 2', price: 5, quantity: 2, created_at: new Date() },
        ])

      // WHEN
      const { record } = await request
        .post(`${url}/api/table/invoices`, {
          data: { items: ['1', '2'] },
        })
        .then((res) => res.json())

      // THEN
      expect(record.names).toBe('item 1,item 2')
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
          name: 'Jane',
          created_at: new Date(),
        },
        {
          id: '2',
          name: 'John',
          created_at: new Date(),
        },
      ])
      await database.table('teams').create()

      // WHEN
      const url = await app.start(config)
      const { record } = await request
        .post(url + '/api/table/teams', {
          data: { members: ['1', '2'] },
        })
        .then((res) => res.json())

      // THEN
      expect(record.names).toBe('Jane, John')
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
          name: 'Jane',
          created_at: new Date(),
        },
        {
          id: '2',
          name: 'John',
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
      const url = await app.start(config)
      const { record } = await request
        .post(url + '/api/table/teams', {
          data: { members: ['1', '2'] },
        })
        .then((res) => res.json())

      // THEN
      expect(record.names).toBe('Jane, John')
    })
  })
})
