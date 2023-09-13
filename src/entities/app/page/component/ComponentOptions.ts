import { ContainerComponentOptions } from './container/ContainerComponentOptions'
import { FormComponentOptions } from './form/FormComponentOptions'
import { LinkComponentOptions } from './link/LinkComponentOptions'
import { ListComponentOptions } from './list/ListComponentOptions'
import { NavigationComponentOptions } from './navigation/NavigationComponentOptions'
import { ParagraphComponentOptions } from './paragraph/ParagraphComponentOptions'
import { TitleComponentOptions } from './title/TitleComponentOptions'

export type ComponentOptions =
  | LinkComponentOptions
  | ParagraphComponentOptions
  | NavigationComponentOptions
  | TitleComponentOptions
  | ListComponentOptions
  | FormComponentOptions
  | ContainerComponentOptions
