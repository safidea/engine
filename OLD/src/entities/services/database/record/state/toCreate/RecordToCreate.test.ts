import { describe, test, expect } from 'bun:test'
import { RecordToCreate } from './RecordToCreate'
import { Table } from '@entities/app/table/Table'

describe('RecordToCreate', () => {
  test('should create a record with default values', async () => {
    // GIVEN
    const values = {
      id: '1',
    }
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'name',
            type: 'single_line_text',
            default: 'test',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const record = new RecordToCreate(values, table)

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
    const table = new Table(
      {
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
      },
      {} as any
    )

    // WHEN
    const record = new RecordToCreate(values, table)

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
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'name',
            type: 'single_line_text',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const call = () => new RecordToCreate(values, table)

    // THEN
    expect(call).toThrow('field "name" is required')
  })

  test('should throw an error if a field is missing', async () => {
    // GIVEN
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'single_line_text',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const call = () => new RecordToCreate({}, table)

    // THEN
    expect(call).toThrow('field "fieldA" is required')
  })

  test('should throw an error if a field is not an number and should be', async () => {
    // GIVEN
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'number',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const call = () => new RecordToCreate({ fieldA: 'test' }, table)

    // THEN
    expect(call).toThrow('field "fieldA" must be a number')
  })

  test('should convert a non string value to a string if field is a text type', async () => {
    // GIVEN
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'single_line_text',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const record = new RecordToCreate({ fieldA: 123 }, table)

    // THEN
    expect(record.getFieldValue('fieldA')).toBe('123')
  })

  test('should throw an error if a field is not an datetime and should be', async () => {
    // GIVEN
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'datetime',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const call = () => new RecordToCreate({ fieldA: 'text' }, table)

    // THEN
    expect(call).toThrow('field "fieldA" must be a valid date')
  })

  test('should throw an error if a multiple linked field is not valid', async () => {
    // GIVEN
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'multiple_linked_records',
            table: 'tableB',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const call = () => new RecordToCreate({ fieldA: 'text' }, table)

    // THEN
    expect(call).toThrow('field "fieldA" must be an array')
  })

  test('should not throw an error if a number field is 0', async () => {
    // GIVEN
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'number',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const call = () => new RecordToCreate({ fieldA: 0 }, table)

    // THEN
    expect(call).not.toThrow()
  })

  test('should not throw an error if a autonumber field is missing', async () => {
    // GIVEN
    const table = new Table(
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'autonumber',
          },
        ],
      },
      {} as any
    )

    // WHEN
    const call = () => new RecordToCreate({}, table)

    // THEN
    expect(call).not.toThrow()
  })
})
