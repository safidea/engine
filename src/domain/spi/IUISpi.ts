import { FormUI } from '@domain/spi/ui/FormUI'
import { LinkUI } from '@domain/spi/ui/LinkUI'
import { ListUI } from '@domain/spi/ui/ListUI'
import { NavigationUI } from '@domain/spi/ui/NavigationUI'
import { ParagraphUI } from '@domain/spi/ui/ParagraphUI'
import { TitleUI } from '@domain/spi/ui/TitleUI'
import { TableInputUI } from '@domain/spi/ui/inputs/TableInputUI'
import { TextInputUI } from '@domain/spi/ui/inputs/TextInputUI'
import { SingleSelectRecordInputUI } from './ui/inputs/SingleSelectRecordInputUI'
import { SingleSelectInputUI } from './ui/inputs/SingleSelectInputUI'
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
