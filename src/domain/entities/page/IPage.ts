import type { IPageComponent } from './IPageComponent'
import type { IPageSeo } from './IPageSeo'

export interface IPage {
  name: string
  path: string
  seo: IPageSeo
  body: IPageComponent[]
}
