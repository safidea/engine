import type { Button, Props as ButtonProps } from './base/Button'
import type { HtmlProps } from './base/Html'
import type { Link, Props as LinkProps } from './base/Link'
import type { Paragraph, Props as ParagraphProps } from './base/Paragraph'
import type { Form, Props as FormProps } from './application/Form'
import type { ReactComponent } from './base/base'
import type { Cta, Props as CtaProps } from './marketing/Cta'
import type { Features, Props as FeaturesProps } from './marketing/Features'
import type { Footer, Props as FooterProps } from './marketing/Footer'
import type { Hero, Props as HeroProps } from './marketing/Hero'
import type { Logos, Props as LogosProps } from './marketing/Logos'
import type { NotFound, Props as NotFoundProps } from './marketing/NotFound'
import type { Header, Props as HeaderProps } from './marketing/Header'
import type { Table, Props as TableProps } from './application/Table'
import type { Sidebar, Props as SidebarProps } from './application/Sidebar'
import type { Title, Props as TitleProps } from './base/Title'
import type { InvalidBlock } from './base/InvalidBlock'
import type { Input, Props as InputProps } from './base/Input'
import type { Icon, Props as IconProps } from './base/Icon'
import type { Image, Props as ImageProps } from './base/Image'
import type { List, Props as ListProps } from './application/List'
import type { Heading, Props as HeadingProps } from './application/Heading'
import type { Modal, Props as ModalProps } from './application/Modal'
import type { Container, Props as ContainerProps } from './base/Container'
import type { Customized } from './Customized'

export type Component =
  | Paragraph
  | Button
  | Cta
  | Features
  | Footer
  | Hero
  | Logos
  | NotFound
  | Form
  | Link
  | Header
  | Table
  | Sidebar
  | Title
  | InvalidBlock
  | Input
  | Icon
  | Image
  | List
  | Heading
  | Customized
  | Modal
  | Container

export interface ReactComponents {
  Html: ReactComponent<HtmlProps>
  Paragraph: ReactComponent<ParagraphProps>
  Hero: ReactComponent<HeroProps>
  Logos: ReactComponent<LogosProps>
  Features: ReactComponent<FeaturesProps>
  Cta: ReactComponent<CtaProps>
  Button: ReactComponent<ButtonProps>
  Footer: ReactComponent<FooterProps>
  NotFound: ReactComponent<NotFoundProps>
  Form: ReactComponent<FormProps>
  Link: ReactComponent<LinkProps>
  Header: ReactComponent<HeaderProps>
  Table: ReactComponent<TableProps>
  Sidebar: ReactComponent<SidebarProps>
  Title: ReactComponent<TitleProps>
  Input: ReactComponent<InputProps>
  Icon: ReactComponent<IconProps>
  Image: ReactComponent<ImageProps>
  List: ReactComponent<ListProps>
  Heading: ReactComponent<HeadingProps>
  Modal: ReactComponent<ModalProps>
  Container: ReactComponent<ContainerProps>
}

export interface Props {
  Html: HtmlProps
  Paragraph: ParagraphProps
  Hero: HeroProps
  Logos: LogosProps
  Features: FeaturesProps
  Cta: CtaProps
  Button: ButtonProps
  Footer: FooterProps
  NotFound: NotFoundProps
  Form: FormProps
  Link: LinkProps
  Header: HeaderProps
  Table: TableProps
  Sidebar: SidebarProps
  Title: TitleProps
  Input: InputProps
  Icon: IconProps
  Image: ImageProps
  List: ListProps
  Heading: HeadingProps
  Modal: ModalProps
  Container: ContainerProps
}
