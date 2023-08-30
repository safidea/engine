import { IUISpi } from '@domain/spi/IUISpi'
import LinkTailwindUI from './LinkTailwindUI'
import ParagraphTailwindUI from './ParagraphTailwindUI'
import TitleTailwindUI from './TitleTailwindUI'
import NavigationTailwindUI from './NavigationTailwindUI'
import ListTailwindUI from './ListTailwindUI'
import FormTailwindUI from './FormTailwindUI'
import TableInputTailwindUI from './TableInputTailwindUI'
import TextInputTailwindUI from './TextInputTailwindUI'
import SingleSelectRecordInputTailwindUI from './SingleSelectRecordInputTailwindUI'
import SingleSelectInputTailwindUI from './SingleSelectInputTailwindUI'

export const TailwindUI: IUISpi = {
  name: 'TailwindUI',
  LinkUI: LinkTailwindUI,
  ParagraphUI: ParagraphTailwindUI,
  TitleUI: TitleTailwindUI,
  NavigationUI: NavigationTailwindUI,
  ListUI: ListTailwindUI,
  FormUI: FormTailwindUI,
  TextInputUI: TextInputTailwindUI,
  TableInputUI: TableInputTailwindUI,
  SingleSelectRecordInputUI: SingleSelectRecordInputTailwindUI,
  SingleSelectInputUI: SingleSelectInputTailwindUI,
}
