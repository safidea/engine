import type { IFeature } from '../feature/IFeature'
import type { IRole } from '../role/IRole'
import type { ITranslation } from '../translation/ITranslation'

export interface IApp {
  name: string
  features: IFeature[]
  roles?: IRole[]
  translations?: ITranslation[]
}
