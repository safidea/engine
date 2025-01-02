import { test, expect, NodeApp } from '@test/fixtures'
import Database from '@test/drivers/database'
import { type Config } from '@latechforce/engine'

Database.each(test, (dbConfig) => {
  test('should create a record with a single select field', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'cars',
          fields: [
            {
              name: 'color',
              field: 'SingleSelect',
              options: ['Red', 'Blue', 'Green'],
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new NodeApp()
    const { url } = await app.start(config)

    // WHEN
    const { record } = await request
      .post(`${url}/api/table/cars`, { data: { color: 'Red' } })
      .then((res) => res.json())

    // THEN
    expect(record.fields.color).toBe('Red')
  })

  test('should not create a record with a wrong value in a single select field', async ({
    request,
  }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'cars',
          fields: [
            {
              name: 'color',
              field: 'SingleSelect',
              options: ['Red', 'Blue', 'Green'],
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new NodeApp()
    const { url } = await app.start(config)

    // WHEN
    const { error } = await request
      .post(`${url}/api/table/cars`, { data: { color: 'Yellow' } })
      .then((res) => res.json())

    // THEN
    expect(error).toStrictEqual({
      instancePath: '/color',
      keyword: 'enum',
      message: 'must be equal to one of the allowed values',
      params: { allowedValues: ['Red', 'Blue', 'Green'] },
      schemaPath: '#/properties/color/enum',
    })
  })
})
