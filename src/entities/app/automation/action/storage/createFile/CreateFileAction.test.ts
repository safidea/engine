import { TableList } from '@entities/app/table/TableList'
import { describe, test, expect } from '@jest/globals'
import { CreateFileAction } from './CreateFileAction'
import { BucketList } from '@entities/app/bucket/BucketList'

describe('CreateFileAction', () => {
  test('should render a file with a list of object', async () => {
    // GIVEN
    const tables = new TableList(
      [
        {
          name: 'tableA',
          fields: [
            {
              name: 'name',
              type: 'single_line_text',
            },
            {
              name: 'items',
              type: 'multiple_linked_records',
              table: 'tableB',
            },
          ],
        },
        {
          name: 'tableB',
          fields: [
            {
              name: 'name',
              type: 'single_line_text',
            },
            {
              name: 'number',
              type: 'number',
            },
          ],
        },
      ],
      {
        database: {} as any,
      } as any
    )
    const buckets = new BucketList([{ name: 'bucketA' }], { storage: {} as any })
    const converter = {
      htmlToPdf: jest.fn().mockReturnValue('pdf'),
    }
    const storage = {
      upload: jest.fn().mockReturnValue('url'),
    }
    const templater = {
      compile: jest.fn((value) => ({
        render: jest.fn(() => value),
      })),
    } as any
    const action = new CreateFileAction(
      {
        name: 'create_file',
        type: 'create_file',
        filename: 'test.pdf',
        input: 'html',
        output: 'pdf',
        template:
          '<html><body><p>{{name}}</p><ul>{{#each items}}<li>{{ this.name }} - {{ this.number }}</li>{{/each}}</ul></body></html>',
        bucket: 'bucketA',
        data: {
          name: '{{ record_created.data.name }}',
          'items.$.name': '{{ record_created.data.items.$.name }}',
          'items.$.number': '{{ record_created.data.items.$.number }}',
        },
      },
      { converter, storage, templater } as any,
      { tables, buckets } as any
    )

    // WHEN
    action.execute({
      record_created: {
        table: 'tableA',
        data: {
          name: 'Record A',
          items: [
            {
              name: 'Record B',
              number: 1,
            },
            {
              name: 'Record C',
              number: 2,
            },
          ],
        },
      },
    })

    // THEN
    expect(converter.htmlToPdf).toHaveBeenCalledWith(
      '<html><body><p>{{name}}</p><ul>{{#each items}}<li>{{ this.name }} - {{ this.number }}</li>{{/each}}</ul></body></html>'
    )
  })
})
