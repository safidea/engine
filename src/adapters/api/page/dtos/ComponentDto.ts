import { JSONSchemaType } from 'ajv'
import { FormDto, FormDtoSchema } from './components/FormDto'
import { LinkDto, LinkDtoSchema } from './components/LinkDto'
import { ListDto, ListDtoSchema } from './components/ListDto'
import { NavigationDto, NavigationDtoSchema } from './components/NavigationDto'
import { ParagraphDto, ParagraphDtoSchema } from './components/ParagraphDto'
import { TitleComponentDto, TitleComponentDtoSchema } from './components/TitleComponentDto'
import {
  ContainerComponentDto,
  ContainerComponentDtoSchema,
} from './components/ContainerComponentDto'

export type ComponentDto =
  | LinkDto
  | ParagraphDto
  | NavigationDto
  | TitleComponentDto
  | ListDto
  | FormDto
  | ContainerComponentDto

export const ComponentDtoSchema: JSONSchemaType<ComponentDto> = {
  $id: 'https://example.com/component.json',
  oneOf: [
    LinkDtoSchema,
    ParagraphDtoSchema,
    NavigationDtoSchema,
    TitleComponentDtoSchema,
    ListDtoSchema,
    FormDtoSchema,
    ContainerComponentDtoSchema,
  ],
}
