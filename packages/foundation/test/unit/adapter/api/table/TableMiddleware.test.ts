import { AppMapper } from '@adapter/api/app/mappers/AppMapper'
import { TableMiddleware } from '@adapter/api/table/TableMiddleware'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { describe, test, expect } from '@jest/globals'

describe('TableMiddleware', () => {
  describe('validateRecordBody', () => {
    test('should validate the request body', async () => {
      // GIVEN
      const app = AppMapper.toEntity(
        {
          tables: [
            {
              name: 'tableA',
              fields: [
                {
                  name: 'fieldA',
                  type: 'single_line_text',
                },
              ],
            },
          ],
        },
        { ui: UnstyledUI, log: console.log }
      )

      // WHEN
      const call = () =>
        new TableMiddleware(app, {} as any).validateRecordBody('tableA', {
          fieldA: 'valueA',
        })

      // THEN
      await expect(call()).resolves.not.toThrow()
    })
  })

  describe('validateRecordValues', () => {
    test('should throw an error if a field is missing', async () => {
      // GIVEN
      const app = AppMapper.toEntity(
        {
          tables: [
            {
              name: 'tableA',
              fields: [
                {
                  name: 'fieldA',
                  type: 'single_line_text',
                },
              ],
            },
          ],
        },
        { ui: UnstyledUI, log: console.log }
      )

      // WHEN
      const call = () => new TableMiddleware(app, {} as any).validateRecordValues('tableA', {}, 'create')

      // THEN
      await expect(call()).rejects.toThrowError('field "fieldA" is required')
    })

    test('should throw an error if a field is not an number and should be', async () => {
      // GIVEN
      const app = AppMapper.toEntity(
        {
          tables: [
            {
              name: 'tableA',
              fields: [
                {
                  name: 'fieldA',
                  type: 'number',
                },
              ],
            },
          ],
        },
        { ui: UnstyledUI, log: console.log }
      )

      // WHEN
      const call = () =>
        new TableMiddleware(app, {} as any).validateRecordValues(
          'tableA',
          {
            fieldA: 'test',
          },
          'create'
        )

      // THEN
      await expect(call()).rejects.toThrowError('field "fieldA" must be a number')
    })

    test('should convert a non string value to a string if field is a text type', async () => {
      // GIVEN
      const app = AppMapper.toEntity(
        {
          tables: [
            {
              name: 'tableA',
              fields: [
                {
                  name: 'fieldA',
                  type: 'single_line_text',
                },
              ],
            },
          ],
        },
        { ui: UnstyledUI, log: console.log }
      )

      // WHEN
      const record = await new TableMiddleware(app, {} as any).validateRecordValues(
        'tableA',
        {
          fieldA: 123,
        },
        'create'
      )

      // THEN
      expect(record.getFieldValue('fieldA')).toBe('123')
    })

    test('should throw an error if a field is not an datetime and should be', async () => {
      // GIVEN
      const app = AppMapper.toEntity(
        {
          tables: [
            {
              name: 'tableA',
              fields: [
                {
                  name: 'fieldA',
                  type: 'datetime',
                },
              ],
            },
          ],
        },
        { ui: UnstyledUI, log: console.log }
      )

      // WHEN
      const call = () =>
        new TableMiddleware(app, {} as any).validateRecordValues(
          'tableA',
          {
            fieldA: 'text',
          },
          'create'
        )

      // THEN
      await expect(call()).rejects.toThrowError('field "fieldA" must be a valid date')
    })

    test('should throw an error if a multiple linked field is not valid', async () => {
      // GIVEN
      const app = AppMapper.toEntity(
        {
          tables: [
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
          ],
        },
        { ui: UnstyledUI, log: console.log }
      )

      // WHEN
      const call = () =>
        new TableMiddleware(app, {} as any).validateRecordValues(
          'tableA',
          {
            fieldA: 'text',
          },
          'create'
        )

      // THEN
      await expect(call()).rejects.toThrowError('field "fieldA" must be an array')
    })

    test('should not throw an error if a number field is 0', async () => {
      // GIVEN
      const app = AppMapper.toEntity(
        {
          tables: [
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
          ],
        },
        { ui: UnstyledUI, log: console.log }
      )

      // WHEN
      const call = () =>
        new TableMiddleware(app, {} as any).validateRecordValues(
          'tableA',
          {
            fieldA: ['1'],
          },
          'create'
        )

      // THEN
      await expect(call()).resolves.not.toThrow()
    })

    test('should validate a request body with an updated record', async () => {
      // GIVEN
      const app = AppMapper.toEntity(
        {
          tables: [
            {
              name: 'tableA',
              fields: [
                {
                  name: 'fieldA',
                  type: 'single_line_text',
                },
              ],
            },
          ],
        },
        { ui: UnstyledUI, log: console.log }
      )

      // WHEN
      const call = () =>
        new TableMiddleware(app, {} as any).validateRecordValues(
          'tableA',
          {
            id: '1',
            fieldA: 'text',
          },
          'update'
        )

      // THEN
      await expect(call()).resolves.not.toThrow()
    })
  })
})
