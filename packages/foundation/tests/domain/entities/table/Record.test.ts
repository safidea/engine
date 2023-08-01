import { FieldDto } from '@application/dtos/table/FieldDto'
import { mapDtoToField } from '@application/mappers/table/FieldMapper'
import { Field } from '@domain/entities/table/Field'
import { Record } from '@domain/entities/table/Record'
import { describe, test, expect } from '@jest/globals'

describe('Record', () => {
  test('should throw an error if there is no id in values', async () => {
    // GIVEN
    const tableName = 'tableA'
    const values = {
      name: 'test',
    }

    // WHEN
    const call = () => new Record(tableName, values, [])

    // THEN
    expect(call).toThrowError('Record must have an id')
  })

  test('should return a record with default values', async () => {
    // GIVEN
    const tableName = 'tableA'
    const values = {
      id: '1',
    }
    const fields: Field[] = [
      {
        name: 'name',
        type: 'single_line_text',
        default: 'test',
      },
    ].map((field) => mapDtoToField(field as FieldDto))

    // WHEN
    const record = new Record(tableName, values, fields)

    // THEN
    expect(record.fields.name).toEqual('test')
  })

  test('should create a record without calculated fields', async () => {
    // GIVEN
    const tableName = 'tableA'
    const values = {
      id: '1',
      fieldA: 'test',
      fieldB: 'test',
    }
    const fields: Field[] = [
      {
        name: 'fieldA',
        type: 'formula',
        formula: '"test"',
      },
      {
        name: 'fieldB',
        type: 'single_line_text',
      },
    ].map((field) => mapDtoToField(field as FieldDto))

    // WHEN
    const record = new Record(tableName, values, fields)

    // THEN
    expect(record.fields).toEqual({
      fieldB: 'test',
    })
  })

  test('should throw an error if a field is required in "created" status', async () => {
    // GIVEN
    const tableName = 'tableA'
    const values = {
      id: '1',
    }
    const fields: Field[] = [
      {
        name: 'name',
        type: 'single_line_text',
      },
    ].map((field) => mapDtoToField(field as FieldDto))

    // WHEN
    const call = () => new Record(tableName, values, fields)

    // THEN
    expect(call).toThrowError('Field "name" is required')
  })

  test('should create a record with "updated" status', async () => {
    // GIVEN
    const tableName = 'tableA'
    const values = {
      id: '1',
      name: 'test',
    }
    const fields: Field[] = [
      {
        name: 'name',
        type: 'single_line_text',
      },
      {
        name: 'age',
        type: 'number',
      },
    ].map((field) => mapDtoToField(field as FieldDto))

    // WHEN
    const record = new Record(tableName, values, fields, 'updated')

    // THEN
    expect(record.fields.name).toEqual('test')
    expect(record.fields).not.toHaveProperty('age')
  })
})
