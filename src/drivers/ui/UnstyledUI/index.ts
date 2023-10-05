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
import ButtonUnstyledUI from './button/ButtonUnstyledUI'
import IconUnstyledUI from './icon/IconUnstyledUI'
import { IIconDriver } from '@adapters/mappers/driver/IIconDriver'
import CardUnstyledUI from './card/CardTailwindUI'

export class UnstyledUI implements IUIDriver {
  readonly name = 'unstyled'
  readonly LinkUI = LinkUnstyledUI
  readonly ParagraphUI = ParagraphUnstyledUI
  readonly TitleUI = TitleUnstyledUI
  readonly NavigationUI = NavigationUnstyledUI
  readonly ListUI = ListUnstyledUI
  readonly FormUI = FormUnstyledUI
  readonly TextInputUI = TextInputUnstyledUI
  readonly TableInputUI = TableInputUnstyledUI
  readonly SingleSelectInputUI = SingleSelectInputUnstyledUI
  readonly ContainerUI = ContainerUnstyledUI
  readonly ColumnsUI = ColumnsUnstyledUI
  readonly ImageUI = ImageUnstyledUI
  readonly RowsUI = RowUnstyledUI
  readonly ButtonUI = ButtonUnstyledUI
  readonly CardUI = CardUnstyledUI
  readonly IconUI

  constructor(readonly icon: IIconDriver) {
    this.IconUI = IconUnstyledUI(icon)
  }
}
