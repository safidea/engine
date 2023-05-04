import TableUtils from '@table/server/utils/table.utils'
import { ConfigUtils } from '@common/server'

describe('getDefaultFields', () => {
  it('should return default fields', () => {
    const fields = TableUtils.getDefaultFields()
    expect(fields.id).toBeDefined()
    expect(fields.created_at).toBeDefined()
    expect(fields.updated_at).toBeDefined()
    expect(fields.deleted_at).toBeDefined()
  })
})

describe('validateDataFields', () => {
  beforeAll(() => {
    ConfigUtils.set('tables', {
      users: {
        fields: {
          name: {
            type: 'String',
          },
          role: {
            type: 'String',
            default: 'member',
          },
          age: {
            type: 'Int',
            optional: true,
          },
          available: {
            type: 'Boolean',
          },
          start_date: {
            type: 'DateTime',
            optional: true,
          },
        },
      },
    })
  })

  it('should return no errors', () => {
    const errors = TableUtils.validateDataFields('users', { name: 'test', age: 1, available: true })
    expect(errors).toEqual([])
  })

  it('should return errors if no body', () => {
    const errors = TableUtils.validateDataFields('users', undefined)
    expect(errors).toEqual(['Field name is required'])
  })

  it('should return errors on CREATE action', () => {
    const errors = TableUtils.validateDataFields('users', {
      role: 1,
      age: 'test',
      available: 'test',
      start_date: 'test',
      token: 'test',
    })
    expect(errors).toEqual([
      'Field name is required',
      'Field role must be a string',
      'Field age must be an integer',
      'Field available must be a boolean',
      'Field start_date must be a valid date',
      'Invalid fields: token',
    ])
  })

  it('should return errors on UPDATE action', () => {
    const errors = TableUtils.validateDataFields(
      'users',
      {
        role: 1,
        age: 'test',
        available: 'test',
        start_date: 'test',
        token: 'test',
      },
      'UPDATE'
    )
    expect(errors).toEqual([
      'Field role must be a string',
      'Field age must be an integer',
      'Field available must be a boolean',
      'Field start_date must be a valid date',
      'Invalid fields: token',
    ])
  })

  it('should return errors on REPLACE action', () => {
    const errors = TableUtils.validateDataFields(
      'users',
      {
        role: 1,
        age: 'test',
        available: 'test',
        start_date: 'test',
        token: 'test',
      },
      'REPLACE'
    )
    expect(errors).toEqual([
      'Field name is required',
      'Field role must be a string',
      'Field age must be an integer',
      'Field available must be a boolean',
      'Field start_date must be a valid date',
      'Invalid fields: token',
    ])
  })
})
