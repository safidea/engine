import type { ButtonComponent, ButtonBlockRef, ButtonBlock } from './base/Button'
import type { FormComponent, FormBlockRef, FormBlock } from './application/Form'
import type { ParagraphComponent, ParagraphBlockRef, ParagraphBlock } from './base/Paragraph'
import type { CtaComponent, CtaBlockRef, CtaBlock } from './marketing/Cta'
import type { FeaturesComponent, FeaturesBlockRef, FeaturesBlock } from './marketing/Features'
import type { HeroComponent, HeroBlockRef, HeroBlock } from './marketing/Hero'
import type { FooterComponent, FooterBlockRef, FooterBlock } from './marketing/Footer'
import type { LogosComponent, LogosBlockRef, LogosBlock } from './marketing/Logos'
import type { NotFoundComponent, NotFoundBlockRef, NotFoundBlock } from './marketing/NotFound'
import type { LinkComponent, LinkBlockRef, LinkBlock } from './base/Link'
import type { HeaderComponent, HeaderBlockRef, HeaderBlock } from './marketing/Header'
import type { TableComponent, TableBlockRef, TableBlock } from './application/Table'
import type { SidebarComponent, SidebarBlockRef, SidebarBlock } from './application/Sidebar'
import type { TitleComponent, TitleBlockRef, TitleBlock } from './base/Title'
import type { IconComponent, IconBlockRef, IconBlock } from './base/Icon'
import type { ImageComponent, ImageBlockRef, ImageBlock } from './base/Image'
import type { InputComponent, InputBlockRef, InputBlock } from './base/Input'
import type { ListBlock, ListBlockRef, ListComponent } from './application/List'
import type { HeadingBlock, HeadingBlockRef, HeadingComponent } from './application/Heading'
import type { CustomizedBlockRef, CustomizedComponent, CustomizedBlock } from './customized'
import type { ModalBlock, ModalBlockRef, ModalComponent } from './application/Modal'
import type { DropdownBlock, DropdownBlockRef, DropdownComponent } from './base/Dropdown'
import type { ContainerBlock, ContainerBlockRef, ContainerComponent } from './base/Container'
import type { ColumnsComponent, ColumnsBlockRef, ColumnsBlock } from './base/Columns'

export type Component =
  | ButtonComponent
  | FormComponent
  | ParagraphComponent
  | CtaComponent
  | FeaturesComponent
  | HeroComponent
  | FooterComponent
  | LogosComponent
  | NotFoundComponent
  | LinkComponent
  | HeaderComponent
  | TableComponent
  | SidebarComponent
  | TitleComponent
  | IconComponent
  | ImageComponent
  | InputComponent
  | ListComponent
  | HeadingComponent
  | CustomizedComponent
  | ModalComponent
  | DropdownComponent
  | ContainerComponent
  | ColumnsComponent

export type BlockRef =
  | ButtonBlockRef
  | FormBlockRef
  | ParagraphBlockRef
  | CtaBlockRef
  | FeaturesBlockRef
  | HeroBlockRef
  | FooterBlockRef
  | LogosBlockRef
  | NotFoundBlockRef
  | LinkBlockRef
  | HeaderBlockRef
  | TableBlockRef
  | SidebarBlockRef
  | TitleBlockRef
  | IconBlockRef
  | ImageBlockRef
  | InputBlockRef
  | ListBlockRef
  | HeadingBlockRef
  | CustomizedBlockRef
  | ModalBlockRef
  | DropdownBlockRef
  | ContainerBlockRef
  | ColumnsBlockRef

export type Block =
  | ButtonBlock
  | FormBlock
  | ParagraphBlock
  | CtaBlock
  | FeaturesBlock
  | HeroBlock
  | FooterBlock
  | LogosBlock
  | NotFoundBlock
  | LinkBlock
  | HeaderBlock
  | TableBlock
  | SidebarBlock
  | TitleBlock
  | IconBlock
  | ImageBlock
  | InputBlock
  | ListBlock
  | HeadingBlock
  | CustomizedBlock
  | ModalBlock
  | DropdownBlock
  | ContainerBlock
  | ColumnsBlock

export type ComponentWithBlockRef = Component | BlockRef
