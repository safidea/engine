import type { PersistedDto } from './RecordDto'

export interface RealtimeEventDto {
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
}

export interface RealtimePostgresEventDto extends RealtimeEventDto {
  type: 'PostgresRealtime'
  record: PersistedDto
}

export interface RealtimeSqliteEventDto extends RealtimeEventDto {
  type: 'SqliteRealtime'
  record_id: string
}

export type EventDto = RealtimePostgresEventDto | RealtimeSqliteEventDto
