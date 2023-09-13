import { JSONSchemaType } from 'ajv'
import { ComponentOptions } from './ComponentOptions'
import { FormComponentSchema } from './form/FormComponentSchema'
import { LinkComponentSchema } from './link/LinkComponentSchema'
import { ListComponentSchema } from './list/ListComponentSchema'
import { NavigationComponentSchema } from './navigation/NavigationComponentSchema'
import { ParagraphComponentSchema } from './paragraph/ParagraphComponentSchema'
import { TitleComponentSchema } from './title/TitleComponentSchema'
import { ContainerComponentSchema } from './container/ContainerComponentSchema'

export const ComponentSchema: JSONSchemaType<ComponentOptions> = {
  $id: 'https://example.com/component.json',
  oneOf: [
    LinkComponentSchema,
    ParagraphComponentSchema,
    NavigationComponentSchema,
    TitleComponentSchema,
    ListComponentSchema,
    FormComponentSchema,
    ContainerComponentSchema,
  ],
}
