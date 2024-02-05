import type { SpecDto } from './spec/SpecDto'
import type { PageDto } from './page/PageDto'
import type { TableDto } from './TableDto'

export type FeatureDto = {
  name: string
  role?: string
  specs?: SpecDto[]
  pages?: PageDto[]
  tables?: TableDto[]
}
