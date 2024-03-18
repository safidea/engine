import type { PersistedDto } from './RecordDto'

export interface EventDto {
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: PersistedDto
}
