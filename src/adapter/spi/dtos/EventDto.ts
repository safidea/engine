export interface RealtimeNotificationDto {
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record_id: string
}

export type NotificationDto = RealtimeNotificationDto

export interface EventNotificationDto {
  event: 'notification'
  notification: NotificationDto
}

export interface EventErrorDto {
  event: 'error'
  message: string
}

export type EventDto = EventNotificationDto | EventErrorDto
