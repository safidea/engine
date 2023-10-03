import { IUIDriver } from '@adapters/mappers/ui/IUIDriver'
import LinkUnstyledUI from './link/LinkUnstyledUI'
import ParagraphUnstyledUI from './ParagraphUnstyledUI'
import TitleUnstyledUI from './title/TitleUnstyledUI'
import NavigationUnstyledUI from './NavigationUnstyledUI'
import ListUnstyledUI from './ListUnstyledUI'
import FormUnstyledUI from './FormUnstyledUI'
import TableInputUnstyledUI from './TableInputUnstyledUI'
import TextInputUnstyledUI from './TextInputUnstyledUI'
import SingleSelectInputUnstyledUI from './SingleSelectInputUnstyledUI'
import ContainerUnstyledUI from './container/ContainerUnstyledUI'
import ColumnsUnstyledUI from './columns/ColumnsUnstyledUI'
import ImageUnstyledUI from './image/ImageUnstyledUI'
import RowUnstyledUI from './rows/RowsUnstyledUI'

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
  ColumnsUI: ColumnsUnstyledUI,
  ImageUI: ImageUnstyledUI,
  RowsUI: RowUnstyledUI,
}

export default UnstyledUI
