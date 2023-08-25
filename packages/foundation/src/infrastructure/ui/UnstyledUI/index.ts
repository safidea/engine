import { IUISpi } from '@domain/spi/IUISpi'
import LinkUI from './LinkUI'
import ParagraphUI from './ParagraphUI'
import TitleUI from './TitleUI'
import NavigationUI from './NavigationUI'
import ListUI from './ListUI'
import FormUI from './FormUI'
import TableInputUI from './TableInputUI'
import TextInputUI from './TextInputUI'
import SingleSelectRecordInputUI from './SingleSelectRecordInputUI'
import SingleSelectInputUI from './SingleSelectInputUI'

export const UnstyledUI: IUISpi = {
  name: 'UnstyledUI',
  LinkUI,
  ParagraphUI,
  TitleUI,
  NavigationUI,
  ListUI,
  FormUI,
  TextInputUI,
  TableInputUI,
  SingleSelectRecordInputUI,
  SingleSelectInputUI,
}
