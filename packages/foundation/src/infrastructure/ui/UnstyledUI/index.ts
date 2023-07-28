import { IUIGateway } from '@domain/gateways/IUIGateway'
import LinkUI from './LinkUI'
import ParagraphUI from './ParagraphUI'
import TitleUI from './TitleUI'
import NavigationUI from './NavigationUI'
import ListUI from './ListUI'

export const UnstyledUI: IUIGateway = { LinkUI, ParagraphUI, TitleUI, NavigationUI, ListUI }
