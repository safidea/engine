import type { NotFoundProps } from '@domain/components/marketing/NotFound'
import type { IFeature } from '../feature/IFeature'
import type { IPageHead } from '../page/IPage'
import type { IRole } from '../role/IRole'
import type { ITranslation } from '../translation/ITranslation'

export interface IAppLayoutPageProps extends IPageHead {
  children: React.ReactNode
}

export interface IAppPages extends IPageHead {
  notFound?: NotFoundProps
}

export interface IApp {
  name: string
  features: IFeature[]
  roles?: IRole[]
  translations?: ITranslation[]
  pages?: IAppPages
}
