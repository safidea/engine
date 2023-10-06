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
    if (style.margin) {
      switch (style.margin.top) {
        case 'none':
          className += ' mt-0'
          break
        case 'extra-small':
          className += ' mt-1'
          break
        case 'small':
          className += ' mt-2'
          break
        case 'medium':
          className += ' mt-4'
          break
        case 'large':
          className += ' mt-8'
          break
        case 'extra-large':
          className += ' mt-16'
          break
      }
      switch (style.margin.bottom) {
        case 'none':
          className += ' mb-0'
          break
        case 'extra-small':
          className += ' mb-1'
          break
        case 'small':
          className += ' mb-2'
          break
        case 'medium':
          className += ' mb-4'
          break
        case 'large':
          className += ' mb-8'
          break
        case 'extra-large':
          className += ' mb-16'
          break
      }
      switch (style.margin.left) {
        case 'none':
          className += ' ml-0'
          break
        case 'extra-small':
          className += ' ml-1'
          break
        case 'small':
          className += ' ml-2'
          break
        case 'medium':
          className += ' ml-4'
          break
        case 'large':
          className += ' ml-8'
          break
        case 'extra-large':
          className += ' ml-16'
          break
      }
      switch (style.margin.right) {
        case 'none':
          className += ' mr-0'
          break
        case 'extra-small':
          className += ' mr-1'
          break
        case 'small':
          className += ' mr-2'
          break
        case 'medium':
          className += ' mr-4'
          break
        case 'large':
          className += ' mr-8'
          break
        case 'extra-large':
          className += ' mr-16'
          break
      }
    }
    return className.trim()
  }
}
