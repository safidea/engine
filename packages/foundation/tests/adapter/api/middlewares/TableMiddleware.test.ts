import { TableMiddleware } from '@adapter/api/middlewares/TableMiddleware'
import { TableDto } from '@application/dtos/table/TableDto'
import { mapDtoToTable } from '@application/mappers/table/TableMapper'
import { App } from '@domain/entities/App'
import { Table } from '@domain/entities/table/Table'
import { describe, test, expect } from '@jest/globals'

describe('TableMiddleware', () => {
  describe('validatePostBody', () => {
    test('should validate the request body', async () => {
      // GIVEN
      const tables: Table[] = [
        {
          name: 'tableA',
          fields: [
            {
              name: 'fieldA',
              type: 'single_line_text',
            },
          ],
        },
      ].map((table) => mapDtoToTable(table as TableDto))

      // WHEN
      const call = () =>
        new TableMiddleware({ tables } as App, {} as any).validatePostBody('tableA', {
          fieldA: 'valueA',
        })

      // THEN
      await expect(call()).resolves.not.toThrow()
    })

    test('should throw an error if a field is missing', async () => {
      // GIVEN
      const tables: Table[] = [
        {
          name: 'tableA',
          fields: [
            {
              name: 'fieldA',
              type: 'single_line_text',
            },
          ],
        },
      ].map((table) => mapDtoToTable(table as TableDto))

      // WHEN
      const call = () =>
        new TableMiddleware({ tables } as App, {} as any).validatePostBody('tableA', {})

      // THEN
      await expect(call()).rejects.toThrowError('field "fieldA" is required')
    })

    test('should throw an error if a field is not an number and should be', async () => {
      // GIVEN
      const tables: Table[] = [
        {
          name: 'tableA',
          fields: [
            {
              name: 'fieldA',
              type: 'number',
            },
          ],
        },
      ].map((table) => mapDtoToTable(table as TableDto))

      // WHEN
      const call = () =>
        new TableMiddleware({ tables } as App, {} as any).validatePostBody('tableA', {
          fieldA: 'test',
        })

      // THEN
      await expect(call()).rejects.toThrowError('field "fieldA" must be a number')
    })

    test('should throw an error if a field is not an string and should be', async () => {
      // GIVEN
      const tables: Table[] = [
        {
          name: 'tableA',
          fields: [
            {
              name: 'fieldA',
              type: 'single_line_text',
            },
          ],
        },
      ].map((table) => mapDtoToTable(table as TableDto))

      // WHEN
      const call = () =>
        new TableMiddleware({ tables } as App, {} as any).validatePostBody('tableA', {
          fieldA: 123,
        })

      // THEN
      await expect(call()).rejects.toThrowError('field "fieldA" must be a string')
    })

    test('should throw an error if a field is not an datetime and should be', async () => {
      // GIVEN
      const tables: Table[] = [
        {
          name: 'tableA',
          fields: [
            {
              name: 'fieldA',
              type: 'datetime',
            },
          ],
        },
      ].map((table) => mapDtoToTable(table as TableDto))

      // WHEN
      const call = () =>
        new TableMiddleware({ tables } as App, {} as any).validatePostBody('tableA', {
          fieldA: 'text',
        })

      // THEN
      await expect(call()).rejects.toThrowError('field "fieldA" must be a valid date')
    })

    test('should throw an error if a multiple linked field is not valid', async () => {
      // GIVEN
      const tables: Table[] = [
        {
          name: 'tableA',
          fields: [
            {
              name: 'fieldA',
              type: 'multiple_linked_records',
            },
          ],
        },
      ].map((table) => mapDtoToTable(table as TableDto))

      // WHEN
      const call = () =>
        new TableMiddleware({ tables } as App, {} as any).validatePostBody('tableA', {
          fieldA: 'text',
        })

      // THEN
      await expect(call()).rejects.toThrowError(
        'field "fieldA" must be an object with create property'
      )
    })

    test('should throw an error if create property of a multiple linked field is not valid', async () => {
      // GIVEN
      const tables: Table[] = [
        {
          name: 'tableA',
          fields: [
            {
              name: 'fieldA',
              type: 'multiple_linked_records',
            },
          ],
        },
      ].map((table) => mapDtoToTable(table as TableDto))

      // WHEN
      const call = () =>
        new TableMiddleware({ tables } as App, {} as any).validatePostBody('tableA', {
          fieldA: {
            create: 'test' as any,
          },
        })

      // THEN
      await expect(call()).rejects.toThrowError(
        'property "create" at field "fieldA" should be an array of records'
      )
    })

    test('should throw an error if a record of a multiple linked field is not valid', async () => {
      // GIVEN
      const tables: Table[] = [
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
        {
          name: 'tableB',
          fields: [
            {
              name: 'fieldB',
              type: 'number',
            },
          ],
        },
      ].map((table) => mapDtoToTable(table as TableDto))

      // WHEN
      const call = () =>
        new TableMiddleware({ tables } as App, {} as any).validatePostBody('tableA', {
          fieldA: {
            create: [
              {
                fieldB: 'test',
              },
            ],
          },
        })

      // THEN
      await expect(call()).rejects.toThrowError('field "fieldB" must be a number')
    })

    test('should not throw an error if a number field is 0', async () => {
      // GIVEN
      const tables: Table[] = [
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
        {
          name: 'tableB',
          fields: [
            {
              name: 'fieldB',
              type: 'number',
            },
          ],
        },
      ].map((table) => mapDtoToTable(table as TableDto))

      // WHEN
      const call = () =>
        new TableMiddleware({ tables } as App, {} as any).validatePostBody('tableA', {
          fieldA: {
            create: [
              {
                fieldB: 0,
              },
            ],
          },
        })

      // THEN
      await expect(call()).resolves.not.toThrow()
    })
  })
})
