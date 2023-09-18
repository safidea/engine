import LinkUnstyledUI from './LinkUnstyledUI'
import ParagraphUnstyledUI from './ParagraphUnstyledUI'
import TitleUnstyledUI from './TitleUnstyledUI'
import NavigationUnstyledUI from './NavigationUnstyledUI'
import ListUnstyledUI from './ListUnstyledUI'
import FormUnstyledUI from './FormUnstyledUI'
import TableInputUnstyledUI from './TableInputUnstyledUI'
import TextInputUnstyledUI from './TextInputUnstyledUI'
import SingleSelectInputUnstyledUI from './SingleSelectInputUnstyledUI'
import ContainerUnstyledUI from './ContainerUnstyledUI'
import { IUIDriver } from '@adapters/services/ui/IUIDriver'

const UnstyledUI: IUIDriver = {
  name: 'unstyled',
  LinkUI: LinkUnstyledUI,
  ParagraphUI: ParagraphUnstyledUI,
  TitleUI: TitleUnstyledUI,
  NavigationUI: NavigationUnstyledUI,
  ListUI: ListUnstyledUI,
  FormUI: FormUnstyledUI,
  TextInputUI: TextInputUnstyledUI,
  TableInputUI: TableInputUnstyledUI,
  SingleSelectInputUI: SingleSelectInputUnstyledUI,
  ContainerUI: ContainerUnstyledUI,
}

export default UnstyledUI
