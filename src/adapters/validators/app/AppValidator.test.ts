import { describe, test, expect } from '@jest/globals'
import { AppValidator } from './AppValidator'
import { AppDto } from '@adapters/dtos/AppDto'

describe('TableValidator', () => {
  test('should validate the config', async () => {
    // GIVEN
    const config: AppDto = {
      pages: [
        {
          path: '/',
          title: 'Home',
          components: [
            {
              type: 'paragraph',
              text: 'Hello World!',
            },
          ],
        },
      ],
    }

    // WHEN
    const call = () => AppValidator.validateConfig(config)

    // THEN
    expect(call).not.toThrowError()
  })

  test('should throw an error if component does not exist', async () => {
    // GIVEN
    const config = {
      pages: [
        {
          path: '/',
          title: 'Home',
          components: [
            {
              type: 'invalid',
              text: 'Hello World!',
            },
          ],
        },
      ],
    }

    // WHEN
    const call = () => AppValidator.validateConfig(config)

    // THEN
    expect(call).toThrow(
      'Expecting ComponentParams at pages.0.components.0 but instead got: {"type":"invalid","text":"Hello World!"}'
    )
  })

  test('should throw multiple errors if component, field and action are missing', async () => {
    // GIVEN
    const config = {
      pages: [
        {
          path: '/',
          title: 'Home',
          components: [
            {
              type: 'invalid',
              text: 'Hello World!',
            },
          ],
        },
      ],
      tables: [
        {
          name: 'tableA',
          fields: [
            {
              name: 'fieldA',
              type: 'invalid',
            },
          ],
        },
      ],
      automations: [
        {
          name: 'automationA',
          trigger: {
            event: 'record_created',
            table: 'tableA',
          },
          actions: [
            {
              type: 'invalid',
            },
          ],
        },
      ],
    }

    // WHEN
    const call = () => AppValidator.validateConfig(config)

    // THEN
    expect(call).toThrow(
      'Expecting ComponentParams at pages.0.components.0 but instead got: {"type":"invalid","text":"Hello World!"}'
    )
    expect(call).toThrow(
      'Expecting ((({ type: string, name: string } & Partial<{ optional: boolean, format: ("text" | "number" | "currency" | "datetime" | "boolean" | "recordId" | "recordsIds"... at tables.0.fields.0 but instead got: {"name":"fieldA","type":"invalid"}'
    )
    expect(call).toThrow(
      'Expecting ({ name: string, type: "create_file", filename: string, input: "html", output: "pdf", template: (string | { path: string }), bucket: string, data: { [K in st... at automations.0.actions.0 but instead got: {"type":"invalid"}'
    )
  })
})
