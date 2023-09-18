import { Record } from '@entities/services/database/record/Record'
import { describe, test, expect } from '@jest/globals'
import { TableMapper } from '@adapters/api/table/mappers/TableMapper'

describe('Record', () => {
  test('should throw an error if there is no id in values', async () => {
    // GIVEN
    const table = TableMapper.toEntity({
      name: 'tableA',
      fields: [
        {
          name: 'fieldA',
          type: 'single_line_text',
        },
      ],
    })
    const values = {
      name: 'test',
    }

    // WHEN
    const call = () => new Record(values, table)

    // THEN
    expect(call).toThrowError('record state read must have an id')
  })

  test('should create a record with default values', async () => {
    // GIVEN
    const values = {
      id: '1',
    }
    const table = TableMapper.toEntity({
      name: 'tableA',
      fields: [
        {
          name: 'name',
          type: 'single_line_text',
          default: 'test',
        },
      ],
    })

    // WHEN
    const record = new Record(values, table, 'create')

    // THEN
    expect(record.fields.name).toEqual('test')
  })

  test('should create a record without calculated fields', async () => {
    // GIVEN
    const values = {
      id: '1',
      fieldA: 'test',
      fieldB: 'test',
    }
    const table = TableMapper.toEntity({
      name: 'tableA',
      fields: [
        {
          name: 'fieldA',
          type: 'formula',
          formula: '"test"',
        },
        {
          name: 'fieldB',
          type: 'single_line_text',
        },
      ],
    })

    // WHEN
    const record = new Record(values, table, 'create')

    // THEN
    expect(record.fields).toEqual({
      fieldB: 'test',
    })
  })

  test('should throw an error if a field is required in "created" status', async () => {
    // GIVEN
    const values = {
      id: '1',
    }
    const table = TableMapper.toEntity({
      name: 'tableA',
      fields: [
        {
          name: 'name',
          type: 'single_line_text',
        },
      ],
    })

    // WHEN
    const call = () => new Record(values, table, 'create')

    // THEN
    expect(call).toThrowError('field "name" is required')
  })

  test('should create a record with "updated" status', async () => {
    // GIVEN
    const values = {
      id: '1',
      name: 'test',
    }
    const table = TableMapper.toEntity({
      name: 'tableA',
      fields: [
        {
          name: 'name',
          type: 'single_line_text',
        },
        {
          name: 'age',
          type: 'number',
        },
      ],
    })

    // WHEN
    const record = new Record(values, table, 'update')

    // THEN
    expect(record.fields.name).toEqual('test')
    expect(record.fields).not.toHaveProperty('age')
  })

  test('should throw an error if update permission is not respected', async () => {
    // GIVEN
    const table = TableMapper.toEntity({
      name: 'tableA',
      fields: [
        {
          name: 'name',
          type: 'single_line_text',
          permissions: {
            update: {
              formula: 'age === undefined',
            },
          },
        },
        {
          name: 'age',
          type: 'number',
          optional: true,
        },
      ],
    })
    const updatedRecord = new Record(
      {
        id: '1',
        name: 'test updated',
      },
      table,
      'update'
    )
    const persistedRecord = new Record(
      {
        id: '1',
        created_time: new Date().toISOString(),
        name: 'test',
        age: 10,
      },
      table
    )

    // WHEN
    const call = () => updatedRecord.validateFieldsPermissions(persistedRecord.fields)

    // THEN
    expect(call).toThrowError('field "name" cannot be updated')
  })
})