import { ContainerUI } from './container/ContainerComponentUI'
import { FormUI } from './form/FormComponentUI'
import { SingleSelectInputUI } from './singleSelectInput/SingleSelectInputComponentUI'
import { TableInputUI } from './tableInput/TableInputComponentUI'
import { TextInputUI } from './textInput/TextInputComponentUI'
import { LinkUI } from './link/LinkComponentUI'
import { ListUI } from './list/ListComponentUI'
import { NavigationUI } from './navigation/NavigationComponentUI'
import { ParagraphUI } from './paragraph/ParagraphComponentUI'
import { TitleUI } from './title/TitleComponentUI'

export type ComponentUI =
  | FormUI
  | LinkUI
  | ListUI
  | NavigationUI
  | ParagraphUI
  | TitleUI
  | ContainerUI
  | SingleSelectInputUI
  | TableInputUI
  | TextInputUI
