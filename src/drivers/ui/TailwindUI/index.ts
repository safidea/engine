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
import { UIStyle } from '@entities/services/ui/UIStyle'

export type ApplyStyle = (style?: UIStyle, className?: string) => string

export class TailwindUI implements IUIDriver {
  readonly name = 'tailwind'
  readonly LinkUI
  readonly ParagraphUI
  readonly TitleUI
  readonly NavigationUI
  readonly ListUI
  readonly FormUI
  readonly TextInputUI
  readonly TableInputUI
  readonly SingleSelectInputUI
  readonly ContainerUI
  readonly ColumnsUI
  readonly ImageUI
  readonly RowsUI
  readonly ButtonUI
  readonly CardUI
  readonly IconUI

  constructor(readonly icon: IIconDriver) {
    this.IconUI = IconTailwindUI(this.applyStyle, icon)
    this.ColumnsUI = ColumnsTailwindUI(this.applyStyle)
    this.CardUI = CardTailwindUI(this.applyStyle)
    this.ButtonUI = ButtonTailwindUI(this.applyStyle)
    this.RowsUI = RowTailwindUI(this.applyStyle)
    this.ImageUI = ImageTailwindUI(this.applyStyle)
    this.ContainerUI = ContainerTailwindUI(this.applyStyle)
    this.SingleSelectInputUI = SingleSelectInputTailwindUI(this.applyStyle)
    this.TableInputUI = TableInputTailwindUI(this.applyStyle)
    this.TextInputUI = TextInputTailwindUI(this.applyStyle)
    this.FormUI = FormTailwindUI(this.applyStyle)
    this.ListUI = ListTailwindUI(this.applyStyle)
    this.NavigationUI = NavigationTailwindUI(this.applyStyle)
    this.TitleUI = TitleTailwindUI(this.applyStyle)
    this.ParagraphUI = ParagraphTailwindUI(this.applyStyle)
    this.LinkUI = LinkTailwindUI(this.applyStyle)
  }

  applyStyle(style: UIStyle = {}, className = ''): string {
    if (style.background) {
      switch (style.background.color) {
        case 'gray-100':
          className += ' bg-gray-100'
          break
      }
    }
    if (style.items) {
      switch (style.items) {
        case 'center':
          className += ' items-center'
          break
      }
    }
    return className.trim()
  }
}
