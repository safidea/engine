import * as t from 'io-ts'
import { FilterDto } from './FilterDto'
import {
  RecordToCreateDto,
  RecordToUpdateDto,
  RecordToDeleteDto,
  PersistedRecordDto,
} from './RecordDto'

export const SyncResourceDto = t.type({
  table: t.string,
  filters: t.array(FilterDto),
})

export type SyncResourceDto = t.TypeOf<typeof SyncResourceDto>

export const SyncCommandToCreateDto = t.type({
  action: t.literal('toCreate'),
  table: t.string,
  record: RecordToCreateDto,
})

export type SyncCommandToCreateDto = t.TypeOf<typeof SyncCommandToCreateDto>

export const SyncCommandToUpdateDto = t.type({
  action: t.literal('toUpdate'),
  table: t.string,
  record: RecordToUpdateDto,
})

export type SyncCommandToUpdateDto = t.TypeOf<typeof SyncCommandToUpdateDto>

export const SyncCommandToDeleteDto = t.type({
  action: t.literal('toDelete'),
  table: t.string,
  record: RecordToDeleteDto,
})

export type SyncCommandToDeleteDto = t.TypeOf<typeof SyncCommandToDeleteDto>

export const SyncCommandDto = t.union([
  SyncCommandToCreateDto,
  SyncCommandToUpdateDto,
  SyncCommandToDeleteDto,
])

export type SyncCommandDto = t.TypeOf<typeof SyncCommandDto>

export const SyncRecordsByTableDto = t.record(t.string, t.array(PersistedRecordDto))

export type SyncRecordsByTableDto = t.TypeOf<typeof SyncRecordsByTableDto>

export const SyncDto = t.partial({
  commands: t.array(SyncCommandDto),
  resources: t.array(SyncResourceDto),
})

export type SyncDto = t.TypeOf<typeof SyncDto>
