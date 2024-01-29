import type { IPage } from '../page/IPage'
import type { ISpec } from '../spec/ISpec'
import type { ITable } from '../table/ITable'

export interface IFeature {
  name: string
  role?: string
  specs?: ISpec[]
  pages?: IPage[]
  tables?: ITable[]
}
