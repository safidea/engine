import * as t from 'io-ts'
import { ContainerComponentParams } from './container/ContainerComponentParams'
import { FormComponentParams } from './form/FormComponentParams'
import { LinkComponentParams } from './link/LinkComponentParams'
import { ListComponentParams } from './list/ListComponentParams'
import { NavigationComponentParams } from './navigation/NavigationComponentParams'
import { ParagraphComponentParams } from './paragraph/ParagraphComponentParams'
import { TitleComponentParams } from './title/TitleComponentParams'

export const ComponentParams = t.union([
  LinkComponentParams,
  ParagraphComponentParams,
  NavigationComponentParams,
  TitleComponentParams,
  ListComponentParams,
  FormComponentParams,
  ContainerComponentParams,
])

export type ComponentParams = t.TypeOf<typeof ComponentParams>
