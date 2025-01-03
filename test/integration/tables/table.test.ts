import Tester, { expect, it } from 'bun:test'
import { IntegrationTest, type Config } from '@test/integration'

new IntegrationTest(Tester).with({ drivers: ['Database'] }, ({ app, request, drivers }) => {
  it('should start an app with a new table', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'table_1',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
    }

    // WHEN
    await app.start(config)

    // THEN
    expect(drivers.database.table('table_1').exists()).resolves.toBe(true)
  })

  it('should start an app with a existing table', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'table_1',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
    }
    await drivers.database.table('table_1').create()

    // WHEN
    const call = () => app.start(config)

    // THEN
    expect(call()).resolves.toBeDefined()
  })

  it('should migrate a table with a new field', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'table_1',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
    }
    await drivers.database.table('table_1', [{ name: 'name', type: 'TEXT' }]).create()

    // WHEN
    const call = () => app.start(config)

    // THEN
    expect(call()).resolves.toBeDefined()
  })

  it('should migrate a table with a renamed field', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'table_1',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
              onMigration: {
                replace: 'first_name',
              },
            },
          ],
        },
      ],
    }
    const table = drivers.database.table('table_1', [{ name: 'first_name', type: 'TEXT' }])
    await table.create()
    await table.insert({
      id: '1',
      fields: { first_name: 'test' },
      created_at: new Date(),
    })

    // WHEN
    await app.start(config)

    // THEN
    const record = await drivers.database
      .table('table_1', [{ name: 'name', type: 'TEXT' }])
      .readById('1')
    expect(record?.fields.name).toBe('test')
    expect(record?.fields.first_name).toBeUndefined()
  })

  it.skip('should migrate a table with a renamed field that has already be renamed', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'table_1',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
              onMigration: {
                replace: 'first_name',
              },
            },
          ],
        },
      ],
    }
    const table = drivers.database.table('table_1', [{ name: 'name', type: 'TEXT' }])
    await table.create()
    await table.insert({
      id: '1',
      fields: { name: 'test' },
      created_at: new Date(),
    })

    // WHEN
    const call = () => app.start(config)

    // THEN
    expect(call()).resolves.toBeDefined()
  })

  it.skip('should migrate a table with existing records', async () => {
    // GIVEN
    const config: Config = {
      name: 'leads backend',
      tables: [
        {
          name: 'leads',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
            {
              name: 'email',
              field: 'Email',
            },
          ],
        },
      ],
    }
    await app.start(config)
    const leads = drivers.database.table('leads', [{ name: 'email', type: 'TEXT' }])
    await leads.insertMany([
      { id: '1', fields: { name: 'John' }, created_at: new Date() },
      { id: '2', fields: { name: 'Paul' }, created_at: new Date() },
      { id: '3', fields: { name: 'Ringo' }, created_at: new Date() },
    ])
    const newConfig: Config = {
      name: 'leads backend',
      tables: [
        {
          name: 'leads',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
            {
              name: 'email',
              field: 'Email',
            },
          ],
        },
      ],
    }

    // WHEN
    await app.start(newConfig)

    // THEN
    const records = await leads.list()
    expect(records).toHaveLength(3)
    expect(records[0].fields.email).toBeNull()
    expect(records[0].fields.name).toBe('John')
  })

  it.skip('should return an error if table does not exist', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'leads',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
    }
    const { url } = await app.start(config)

    // WHEN
    const response = await request.post(`${url}/api/table/unknown`, {
      name: 'John',
    })

    // THEN
    expect(response.error).toBe('Table "unknown" not found')
  })

  it.skip('should get a created record when posting on table api', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'leads',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
    }
    const { url } = await app.start(config)

    // WHEN
    const response = await request.post(`${url}/api/table/leads`, {
      name: 'John',
    })

    // THEN
    const { record } = response
    expect(record).toBeDefined()
    expect(record.id).toBeDefined()
    expect(record.fields.name).toBe('John')
  })

  it.skip('should create a record in database when posting on table api', async () => {
    // GIVEN
    const config: Config = {
      name: 'leads backend',
      tables: [
        {
          name: 'leads',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
    }
    const { url } = await app.start(config)

    // WHEN
    await request.post(`${url}/api/table/leads`, {
      name: 'John',
    })

    // THEN
    const record = await drivers.database
      .table('leads', [])
      .read({ field: 'name', operator: 'Is', value: 'John' })
    expect(record).toBeDefined()
    expect(record!.id).toBeDefined()
    expect(record!.fields.name).toBe('John')
  })

  it.skip('should create a record with an id with a length of 24', async () => {
    // GIVEN
    const config: Config = {
      name: 'leads backend',
      tables: [
        {
          name: 'leads',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
    }
    const { url } = await app.start(config)

    // WHEN
    await request.post(`${url}/api/table/leads`, {
      name: 'John',
    })

    // THEN
    const record = await drivers.database
      .table('leads', [])
      .read({ field: 'name', operator: 'Is', value: 'John' })
    expect(record).toBeDefined()
    expect(record!.id).toHaveLength(24)
  })

  it.skip('should create a record with a date field', async () => {
    // GIVEN
    const config: Config = {
      name: 'leads backend',
      tables: [
        {
          name: 'leads',
          fields: [
            {
              name: 'today',
              field: 'DateTime',
            },
          ],
        },
      ],
    }
    const { url } = await app.start(config)
    const today = new Date().toISOString()

    // WHEN
    const { record } = await request
      .post(`${url}/api/table/leads`, {
        data: { today },
      })
      .then((res) => res.json())

    // THEN
    expect(record.fields.today).toBe(today)
  })
})
