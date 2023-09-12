import { FormUI } from '@entities/spi/ui/FormUI'
import { LinkUI } from '@entities/spi/ui/LinkUI'
import { ListUI } from '@entities/spi/ui/ListUI'
import { NavigationUI } from '@entities/spi/ui/NavigationUI'
import { ParagraphUI } from '@entities/spi/ui/ParagraphUI'
import { TitleUI } from '@entities/spi/ui/TitleUI'
import { TableInputUI } from '@entities/spi/ui/inputs/TableInputUI'
import { TextInputUI } from '@entities/spi/ui/inputs/TextInputUI'
import { SingleSelectRecordInputUI } from './ui/inputs/SingleSelectRecordInputUI'
import { SingleSelectInputUI } from './components/SingleSelectInputUI'
import { ContainerUI } from './ui/ContainerUI'

export interface IUISpi {
  name: string
  LinkUI: LinkUI
  ParagraphUI: ParagraphUI
  TitleUI: TitleUI
  NavigationUI: NavigationUI
  ListUI: ListUI
  FormUI: FormUI
  TextInputUI: TextInputUI
  TableInputUI: TableInputUI
  SingleSelectRecordInputUI: SingleSelectRecordInputUI
  SingleSelectInputUI: SingleSelectInputUI
  ContainerUI: ContainerUI
}
