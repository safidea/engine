import { UIDrivers } from './UIDrivers'
import { ContainerUI } from '@entities/app/page/component/container/ContainerComponentUI'
import { FormUI } from '@entities/app/page/component/form/FormComponentUI'
import { SingleSelectInputUI } from '@entities/app/page/component/singleSelectInput/SingleSelectInputComponentUI'
import { TableInputUI } from '@entities/app/page/component/tableInput/TableInputComponentUI'
import { TextInputUI } from '@entities/app/page/component/textInput/TextInputComponentUI'
import { LinkUI } from '@entities/app/page/component/link/LinkComponentUI'
import { ListUI } from '@entities/app/page/component/list/ListComponentUI'
import { NavigationUI } from '@entities/app/page/component/navigation/NavigationComponentUI'
import { ParagraphUI } from '@entities/app/page/component/paragraph/ParagraphComponentUI'
import { TitleUI } from '@entities/app/page/component/title/TitleComponentUI'
import { ColumnsUI } from '@entities/app/page/component/columns/ColumnsComponentUI'
import { ImageUI } from '@entities/app/page/component/image/ImageComponentUI'
import { RowsUI } from '@entities/app/page/component/rows/RowsComponentUI'

export interface IUIMapper {
  driverName: UIDrivers
  getTitle: () => TitleUI
  getParagraph: () => ParagraphUI
  getNavigation: () => NavigationUI
  getList: () => ListUI
  getLink: () => LinkUI
  getForm: () => FormUI
  getContainer: () => ContainerUI
  getTextInput: () => TextInputUI
  getTableInput: () => TableInputUI
  getSingleSelectInput: () => SingleSelectInputUI
  getColumns: () => ColumnsUI
  getImage: () => ImageUI
  getRows: () => RowsUI
}
