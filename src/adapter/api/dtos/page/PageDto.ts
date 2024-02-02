import type { ComponentDto } from './ComponentDto'
import type { HeadDto } from './HeadDto'

export type PageDto = {
  name: string
  path: string
  head: HeadDto
  body: ComponentDto[]
}
