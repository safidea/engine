import { JSONSchemaType } from 'ajv'
import { ComponentOptions } from './ComponentOptions'

export const ComponentSchema: JSONSchemaType<ComponentOptions> = {
  $id: 'https://example.com/component.json',
  oneOf: [
    LinkSchema,
    ParagraphSchema,
    NavigationSchema,
    TitleComponentSchema,
    ListSchema,
    FormSchema,
    ContainerComponentSchema,
  ],
}
