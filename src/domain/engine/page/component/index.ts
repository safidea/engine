import type { Button, Props as ButtonProps } from './base/Button'
import type { HtmlProps } from './base/Html'
import type { Link, Props as LinkProps } from './content/Link'
import type { Paragraph, Props as ParagraphProps } from './content/Paragraph'
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
import type { Title, Props as TitleProps } from './content/Title'
import type { Input, Props as InputProps } from './base/Input'
import type { Icon, Props as IconProps } from './content/Icon'
import type { Image, Props as ImageProps } from './content/Image'
import type { List, Props as ListProps } from './application/List'
import type { Heading, Props as HeadingProps } from './application/Heading'
import type { Modal, Props as ModalProps } from './application/Modal'
import type { Dropdown, Props as DropdownProps } from './base/Dropdown'
import type { Container, Props as ContainerProps } from './layout/Container'
import type { Columns, Props as ColumnsProps } from './layout/Columns'
import type { Card, Props as CardProps } from './base/Card'
import type { Divider, Props as DividerProps } from './content/Divider'
import type { Spacer, Props as SpacerProps } from './content/Spacer'
import type { Markdown, Props as MarkdownProps } from './content/Markdown'
import type { Grid, Props as GridProps } from './layout/Grid'

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
  | Input
  | Icon
  | Image
  | List
  | Heading
  | Modal
  | Dropdown
  | Container
  | Columns
  | Card
  | Divider
  | Spacer
  | Markdown
  | Grid

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
  Dropdown: ReactComponent<DropdownProps>
  Container: ReactComponent<ContainerProps>
  Columns: ReactComponent<ColumnsProps>
  Card: ReactComponent<CardProps>
  Divider: ReactComponent<DividerProps>
  Spacer: ReactComponent<SpacerProps>
  Markdown: ReactComponent<MarkdownProps>
  Grid: ReactComponent<GridProps>
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
  Dropdown: DropdownProps
  Container: ContainerProps
  Columns: ColumnsProps
  Card: CardProps
  Divider: DividerProps
  Spacer: SpacerProps
  Markdown: MarkdownProps
  Grid: GridProps
}
