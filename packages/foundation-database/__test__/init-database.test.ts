import Database from '../src/database'
import { testDatabaseUrl } from './setup'

const database = new Database({
  url: testDatabaseUrl,
  provider: 'sqlite',
  tables: {
    users: {
      id: {
        type: 'integer',
        primary: true,
        generated: 'increment',
      },
      name: {
        type: 'string',
        nullable: false,
      },
      email: {
        type: 'string',
        nullable: false,
      },
      password: {
        type: 'string',
        nullable: false,
      },
      created_at: {
        type: 'datetime',
        nullable: false,
      },
      updated_at: {
        type: 'datetime',
        nullable: false,
      },
    },
  }
})

test('should connect to the database', async () => {
  await database.ready
})
