import * as t from 'io-ts'
import { FilterDto } from './FilterDto'
import {
  RecordToCreateDto,
  RecordToUpdateDto,
  RecordToDeleteDto,
  PersistedRecordDto,
} from './RecordDto'

export type SyncResourceDto = {
  readonly table: string
  readonly filters: FilterDto[]
}

export const SyncResourceDto: t.Type<SyncResourceDto> = t.type({
  table: t.string,
  filters: t.array(FilterDto),
})

export type SyncCommandToCreateDto = {
  readonly action: 'toCreate'
  readonly table: string
  readonly record: RecordToCreateDto
}

export const SyncCommandToCreateDto: t.Type<SyncCommandToCreateDto> = t.type({
  action: t.literal('toCreate'),
  table: t.string,
  record: RecordToCreateDto,
})

export type SyncCommandToUpdateDto = {
  readonly action: 'toUpdate'
  readonly table: string
  readonly record: RecordToUpdateDto
}

export const SyncCommandToUpdateDto: t.Type<SyncCommandToUpdateDto> = t.type({
  action: t.literal('toUpdate'),
  table: t.string,
  record: RecordToUpdateDto,
})

export type SyncCommandToDeleteDto = {
  readonly action: 'toDelete'
  readonly table: string
  readonly record: RecordToDeleteDto
}

export const SyncCommandToDeleteDto: t.Type<SyncCommandToDeleteDto> = t.type({
  action: t.literal('toDelete'),
  table: t.string,
  record: RecordToDeleteDto,
})

export type SyncCommandDto =
  | SyncCommandToCreateDto
  | SyncCommandToUpdateDto
  | SyncCommandToDeleteDto

export const SyncCommandDto: t.Type<SyncCommandDto> = t.union([
  SyncCommandToCreateDto,
  SyncCommandToUpdateDto,
  SyncCommandToDeleteDto,
])

export type SyncRecordsByTableDto = {
  [table: string]: PersistedRecordDto[]
}

export const SyncRecordsByTableDto: t.Type<SyncRecordsByTableDto> = t.record(
  t.string,
  t.array(PersistedRecordDto)
)

export type SyncDto = {
  readonly commands?: SyncCommandDto[]
  readonly resources?: SyncResourceDto[]
}

export const SyncDto: t.Type<SyncDto> = t.partial({
  commands: t.array(SyncCommandDto),
  resources: t.array(SyncResourceDto),
})
