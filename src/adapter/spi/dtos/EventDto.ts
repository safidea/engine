import type { PersistedDto } from './RecordDto'

export interface RealtimeNotificationDto {
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
}

export interface PostgresRealtimeNotificationDto extends RealtimeNotificationDto {
  type: 'PostgresRealtime'
  record: PersistedDto
}

export interface SqliteRealtimeNotificationDto extends RealtimeNotificationDto {
  type: 'SqliteRealtime'
  record_id: string
}

export type NotificationDto = PostgresRealtimeNotificationDto | SqliteRealtimeNotificationDto

export interface EventNotificationDto {
  event: 'notification'
  payload?: string
}

export interface EventErrorDto {
  event: 'error'
  message: string
}

export type EventDto = EventNotificationDto | EventErrorDto
