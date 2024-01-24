import type { IPage } from '../page/IPage'
import type { ISpec } from '../spec/ISpec'

export interface IFeature {
  name: string
  role?: string
  specs?: ISpec[]
  pages?: IPage[]
}
