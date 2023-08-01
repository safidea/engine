import { IUIGateway } from '@domain/gateways/IUIGateway'
import LinkUI from './LinkUI'
import ParagraphUI from './ParagraphUI'
import TitleUI from './TitleUI'
import NavigationUI from './NavigationUI'
import ListUI from './ListUI'
import FormUI from './FormUI'
import TableInputUI from './TableInputUI'
import TextInputUI from './TextInputUI'

export const UnstyledUI: IUIGateway = {
  LinkUI,
  ParagraphUI,
  TitleUI,
  NavigationUI,
  ListUI,
  FormUI,
  TextInputUI,
  TableInputUI,
}
