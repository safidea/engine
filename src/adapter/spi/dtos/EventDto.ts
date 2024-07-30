import type { PersistedDto } from './RecordDto'

export interface RealtimeNotificationDto {
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: PersistedDto
}

export type NotificationDto = RealtimeNotificationDto

export interface EventNotificationDto {
  event: 'notification'
  payload?: string
}

export interface EventErrorDto {
  event: 'error'
  message: string
}

export type EventDto = EventNotificationDto | EventErrorDto
