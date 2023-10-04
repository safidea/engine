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
import { UIDrivers } from '@entities/services/ui/UIDrivers'
import { ColumnsUI } from '@entities/app/page/component/columns/ColumnsComponentUI'
import { ImageUI } from '@entities/app/page/component/image/ImageComponentUI'
import { RowsUI } from '@entities/app/page/component/rows/RowsComponentUI'
import { ButtonUI } from '@entities/app/page/component/button/ButtonComponentUI'
import { IconUI } from '@entities/app/page/component/icon/IconComponentUI'

export interface IUIDriver {
  name: UIDrivers
  LinkUI: LinkUI
  ParagraphUI: ParagraphUI
  TitleUI: TitleUI
  NavigationUI: NavigationUI
  ListUI: ListUI
  FormUI: FormUI
  TextInputUI: TextInputUI
  TableInputUI: TableInputUI
  SingleSelectInputUI: SingleSelectInputUI
  ContainerUI: ContainerUI
  ColumnsUI: ColumnsUI
  ImageUI: ImageUI
  RowsUI: RowsUI
  ButtonUI: ButtonUI
  IconUI: IconUI
}
