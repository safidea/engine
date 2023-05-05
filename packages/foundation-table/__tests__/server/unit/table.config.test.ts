import TableConfig from '@table/server/configs/table.config'
import { PrismaUtils } from '@database/server'
import { ConfigUtils } from '@common/server'

import type { TablesInterface } from '@table'

jest.mock('@database/server/utils/prisma.utils')

const tables: TablesInterface = {
  users: {
    database: 'master',
    fields: {
      name: {
        type: 'String',
      },
    },
  },
  tasks: {
    database: 'master',
  },
}

beforeEach(() => {
  jest.clearAllMocks()
  ConfigUtils.set('tables', tables)
})

describe('enrich', () => {
  it('should add default fields', () => {
    TableConfig.enrich()
    const { users } = ConfigUtils.get('tables') as any
    expect(users.fields.id).toBeDefined()
    expect(users.fields.created_at).toBeDefined()
    expect(users.fields.updated_at).toBeDefined()
    expect(users.fields.deleted_at).toBeDefined()
  })
})

describe('validate', () => {
  it('should throw error', () => {
    ConfigUtils.set('tables', { users: 'test' })
    try {
      TableConfig.validate()
    } catch (e: any) {
      expect(e.message).toContain('must be object')
    }
  })

  it('should not throw error', () => {
    TableConfig.validate()
  })
})

describe('lib', () => {
  it('should update model schema', () => {
    TableConfig.lib()
    expect(PrismaUtils.updateModelSchema).toBeCalledTimes(2)
  })

  it('should update model schema even if no fields', () => {
    ConfigUtils.set('tables', {
      users: {
        database: 'master',
      },
    })
    TableConfig.lib()
    expect(PrismaUtils.updateModelSchema).toBeCalledTimes(1)
  })
})
