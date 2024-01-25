import type { IPageComponent } from './IPageComponent'

export interface IPageMeta {
  name: string
  content: string
}

export interface IPageScript {
  src: string
  type?: 'module' | 'text/javascript'
}

export interface IPageLink {
  href: string
}

export interface IPage {
  name: string
  path: string
  body: IPageComponent[]
  title?: string
  metas?: IPageMeta[]
  scripts?: IPageScript[]
  links?: IPageLink[]
}
