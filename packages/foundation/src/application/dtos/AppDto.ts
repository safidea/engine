import { PageDto } from './PageDto'

export interface AppDto {
  name?: string
  version?: string
  pages?: PageDto[]
}
