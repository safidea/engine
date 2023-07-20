import { ComponentDto } from './ComponentDto'

export interface PageDto {
  path: string
  title?: string
  components?: ComponentDto[]
}
