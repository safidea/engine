import { test, expect } from '@test/fixtures'
import Database from '@test/drivers/database'
import App, { type Config } from '@latechforce/engine'

Database.each(test, (dbConfig) => {
  test('should create a record with a single linked record field', async ({ request }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'cars',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
            {
              name: 'model',
              field: 'SingleLinkedRecord',
              table: 'models',
            },
          ],
        },
        {
          name: 'models',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const { url } = await app.start(config)
    await database.table('models').insert({ id: '1', name: 'Model 3', created_at: new Date() })

    // WHEN
    const { record } = await request
      .post(`${url}/api/table/cars`, { data: { name: 'Coccinelle', model: '1' } })
      .then((res) => res.json())

    // THEN
    expect(record.model).toBe('1')
  })

  test('should migrate a table with existing single linked record dependancies', async () => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'cars',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
            {
              name: 'model',
              field: 'SingleLinkedRecord',
              table: 'models',
            },
          ],
        },
        {
          name: 'models',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const models = database.table('models')
    await models.create()
    await models.insertMany([
      { id: '1', name: 'Model 3', created_at: new Date() },
      { id: '2', name: 'Model 4', created_at: new Date() },
      { id: '3', name: 'Model 5', created_at: new Date() },
    ])
    const cars = database.table('cars', [
      {
        name: 'model',
        type: 'TEXT',
        table: 'models',
      },
    ])
    await cars.create()
    await cars.insertMany([
      { id: '1', name: 'Coccinelle', model: '1', created_at: new Date() },
      { id: '2', name: 'Golf', model: '2', created_at: new Date() },
      { id: '3', name: 'Polo', model: '3', created_at: new Date() },
    ])

    // WHEN
    const call = () => app.start(config)

    // THEN
    await expect(call()).resolves.not.toThrow()
  })

  test('should migrate a table after edit SingleTextField to SingleLinkedRecord', async () => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'cars',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
            {
              name: 'model',
              field: 'SingleLinkedRecord',
              table: 'models',
            },
          ],
        },
        {
          name: 'models',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    const cars = database.table('cars', [
      {
        name: 'model',
        type: 'TEXT',
      },
    ])
    await cars.create()
    const models = database.table('models')
    await models.create()
    await models.insert({ id: '1', name: 'Model 3', created_at: new Date() })

    // WHEN
    const call = () => app.start(config)

    // THEN
    await expect(call()).resolves.not.toThrow()
    await expect(
      cars.insert({
        id: '1',
        name: 'Coccinelle',
        model: '1',
        created_at: new Date(),
      })
    ).resolves.not.toThrow()
  })
})
