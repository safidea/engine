import type { IPage } from '../page/IPage'
import type { IRole } from '../role/IRole'
import type { ISpec } from '../spec/ISpec'

export interface IFeature {
  name: string
  story: {
    as: IRole['name']
    iWant: string
    soThat: string
  }
  specs: ISpec[]
  pages: IPage[]
}
