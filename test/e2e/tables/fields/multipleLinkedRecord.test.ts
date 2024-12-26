import { test, expect } from '@test/fixtures'
import Database from '@test/drivers/database'
import App, { type Config } from '@latechforce/engine'

Database.each(test, (dbConfig) => {
  test('should create a record with a multiple linked record field', async ({ request }) => {
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
              name: 'models',
              field: 'MultipleLinkedRecord',
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
    await database.table('models').insertMany([
      { id: '1', name: 'Model 3', created_at: new Date() },
      { id: '2', name: 'Model 5', created_at: new Date() },
    ])

    // WHEN
    const { record } = await request
      .post(`${url}/api/table/cars`, { data: { name: 'Coccinelle', models: ['1', '2'] } })
      .then((res) => res.json())

    // THEN
    expect(record.fields.models).toStrictEqual(['1', '2'])
  })

  test('should not create a record with a bad multiple linked record id', async ({ request }) => {
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
              name: 'models',
              field: 'MultipleLinkedRecord',
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
    await database.table('models').insertMany([
      { id: '1', name: 'Model 3', created_at: new Date() },
      { id: '2', name: 'Model 5', created_at: new Date() },
    ])

    // WHEN
    const { error } = await request
      .post(`${url}/api/table/cars`, { data: { name: 'Coccinelle', models: ['1', '3'] } })
      .then((res) => res.json())

    // THEN
    expect(error).toStrictEqual({
      message:
        dbConfig.driver === 'SQLite'
          ? 'Key is not present in table.'
          : 'Key (models_id)=(3) is not present in table "models".',
    })
  })

  test('should restart an app with a multiple linked record field', async () => {
    // GIVEN
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
              name: 'models',
              field: 'MultipleLinkedRecord',
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
    const startedApp = await app.start(config)
    await startedApp.stop()

    // WHEN
    const call = () => app.start(config)

    // THEN
    await expect(call()).resolves.not.toThrow()
  })
})
