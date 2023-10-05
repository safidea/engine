import { IUIDriver } from '@adapters/mappers/ui/IUIDriver'
import LinkTailwindUI from './link/LinkTailwindUI'
import ParagraphTailwindUI from './paragraph/ParagraphTailwindUI'
import TitleTailwindUI from './title/TitleTailwindUI'
import NavigationTailwindUI from './navigation/NavigationTailwindUI'
import ListTailwindUI from './list/ListTailwindUI'
import FormTailwindUI from './form/FormTailwindUI'
import TableInputTailwindUI from './tableInput/TableInputTailwindUI'
import TextInputTailwindUI from './textInput/TextInputTailwindUI'
import SingleSelectInputTailwindUI from './singleSelectInput/SingleSelectInputTailwindUI'
import ContainerTailwindUI from './container/ContainerTailwindUI'
import ColumnsTailwindUI from './columns/ColumnsTailwindUI'
import ImageTailwindUI from './image/ImageTailwindUI'
import RowTailwindUI from './rows/RowsTailwindUI'
import ButtonTailwindUI from './button/ButtonTailwindUI'
import IconTailwindUI from './icon/IconTailwindUI'
import CardTailwindUI from './card/CardTailwindUI'
import { IIconDriver } from '@adapters/mappers/driver/IIconDriver'

export interface IUIDriverStyle {
  background?: {
    color?: 'gray-100'
  }
}

export class TailwindUI implements IUIDriver {
  readonly name = 'tailwind'
  readonly LinkUI = LinkTailwindUI
  readonly ParagraphUI = ParagraphTailwindUI
  readonly TitleUI = TitleTailwindUI
  readonly NavigationUI = NavigationTailwindUI
  readonly ListUI = ListTailwindUI
  readonly FormUI = FormTailwindUI
  readonly TextInputUI = TextInputTailwindUI
  readonly TableInputUI = TableInputTailwindUI
  readonly SingleSelectInputUI = SingleSelectInputTailwindUI
  readonly ContainerUI = ContainerTailwindUI
  readonly ColumnsUI
  readonly ImageUI = ImageTailwindUI
  readonly RowsUI = RowTailwindUI
  readonly ButtonUI = ButtonTailwindUI
  readonly CardUI = CardTailwindUI
  readonly IconUI

  constructor(readonly icon: IIconDriver) {
    this.IconUI = IconTailwindUI(icon)
    this.ColumnsUI = ColumnsTailwindUI({ applyStyle: this.applyStyle })
  }

  applyStyle(style: IUIDriverStyle, className = ''): string {
    if (style.background) {
      switch (style.background.color) {
        case 'gray-100':
          className += ' bg-gray-100'
          break
      }
    }
    return className.trim()
  }
}
