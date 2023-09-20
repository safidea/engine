import * as t from 'io-ts'
import { ContainerComponentParams } from './container/ContainerComponentParams'
import { FormComponentParams } from './form/FormComponentParams'
import { LinkComponentParams } from './link/LinkComponentParams'
import { ListComponentParams } from './list/ListComponentParams'
import { NavigationComponentParams } from './navigation/NavigationComponentParams'
import { ParagraphComponentParams } from './paragraph/ParagraphComponentParams'
import { TitleComponentParams } from './title/TitleComponentParams'
import { SingleSelectInputComponentParams } from './singleSelectInput/SingleSelectInputComponentParams'
import { SingleSelectRecordInputComponentParams } from './singleSelectRecordInput/SingleSelectRecordInputComponentParams'
import { TableInputComponentParams } from './tableInput/TableInputComponentParams'
import { TextInputComponentParams } from './textInput/TextInputComponentParams'

export type ComponentParams =
  | LinkComponentParams
  | ParagraphComponentParams
  | NavigationComponentParams
  | TitleComponentParams
  | ListComponentParams
  | FormComponentParams
  | ContainerComponentParams
  | TextInputComponentParams
  | TableInputComponentParams
  | SingleSelectRecordInputComponentParams
  | SingleSelectInputComponentParams

export const ComponentParams: t.Type<ComponentParams> = t.recursion('ComponentParams', () =>
  t.union([
    LinkComponentParams,
    ParagraphComponentParams,
    NavigationComponentParams,
    TitleComponentParams,
    ListComponentParams,
    FormComponentParams,
    ContainerComponentParams,
    TextInputComponentParams,
    TableInputComponentParams,
    SingleSelectRecordInputComponentParams,
    SingleSelectInputComponentParams,
  ])
)
