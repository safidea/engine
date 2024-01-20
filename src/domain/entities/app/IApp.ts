import type { IFeature } from '../feature/IFeature'
import type { IRole } from '../role/IRole'

export interface IApp {
  name: string
  roles: IRole[]
  features: IFeature[]
}
