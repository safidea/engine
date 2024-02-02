import type { ActionDto } from './ActionDto'
import type { ResultDto } from './ResultDto'

export interface SpecDto {
  name: string
  when: ActionDto[]
  then: ResultDto[]
}
