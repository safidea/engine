import type { IComponent } from '../component/IComponent'
import type { IFeature } from '../feature/IFeature'
import type { IRole } from '../role/IRole'
import type { ITranslation } from '../translation/ITranslation'

export interface IApp {
  name: string
  roles: IRole[]
  features: IFeature[]
  components: IComponent[]
  translations: ITranslation[]
}
