import type { IRole } from '../role/IRole'

export interface IFeature {
  story: {
    as: IRole['name']
    iWant: string
    soThat: string
  }
}
