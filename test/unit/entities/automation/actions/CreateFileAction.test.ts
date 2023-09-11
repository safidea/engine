import { describe, test, expect } from '@jest/globals'
import { TableMapper } from '@adapters/api/table/mappers/TableMapper'
import { ActionMapper } from '@adapters/api/automation/mappers/ActionMapper'
import { HandlebarsTemplating } from '@drivers/templating/HandlebarsTemplating'

describe('CreateFileAction', () => {
  test('should render a file with a list of object', async () => {
    // GIVEN
    const tables = TableMapper.toEntities([
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
    ])
    const converter = {
      htmlToPdf: jest.fn().mockReturnValue('pdf'),
    }
    const storage = {
      write: jest.fn().mockReturnValue('url'),
    }
    const templating = new HandlebarsTemplating()
    const action = ActionMapper.toEntity(
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
      tables,
      { converter, storage, templating } as any
    )

    // WHEN
    action.execute(
      {
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
      },
      {} as any
    )

    // THEN
    expect(converter.htmlToPdf).toHaveBeenCalledWith(
      '<html><body><p>Record A</p><ul><li>Record B - 1</li><li>Record C - 2</li></ul></body></html>'
    )
  })
})
