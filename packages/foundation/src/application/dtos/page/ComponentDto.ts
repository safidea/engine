import { JSONSchemaType } from '@application/utils/SchemaValidator'
import { FormDto, FormDtoSchema } from './components/FormDto'
import { LinkDto, LinkDtoSchema } from './components/LinkDto'
import { ListDto, ListDtoSchema } from './components/ListDto'
import { NavigationDto, NavigationDtoSchema } from './components/NavigationDto'
import { ParagraphDto, ParagraphDtoSchema } from './components/ParagraphDto'
import { TitleDto, TitleDtoSchema } from './components/TitleDto'

export type ComponentDto = LinkDto | ParagraphDto | NavigationDto | TitleDto | ListDto | FormDto

export const ComponentDtoSchema: JSONSchemaType<ComponentDto> = {
  oneOf: [
    LinkDtoSchema,
    ParagraphDtoSchema,
    NavigationDtoSchema,
    TitleDtoSchema,
    ListDtoSchema,
    FormDtoSchema,
  ],
}
