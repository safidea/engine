import type { ErrorEvent, NotificationEvent } from '@domain/services/Database'
import type { EventErrorDto, EventNotificationDto, NotificationDto } from '../dtos/EventDto'
import { RecordMapper } from './RecordMapper'

export class EventMapper {
  static toNotificationEntity = (dto: EventNotificationDto): NotificationEvent => {
    if (dto.payload) {
      const notification: NotificationDto = JSON.parse(dto.payload)
      const { type } = notification
      if (type === 'PostgresRealtime') {
        return {
          ...notification,
          record: RecordMapper.toPersistedEntity(notification.record),
        }
      }
      if (type === 'SqliteRealtime') {
        return notification
      }
      throw new Error(`EventMapper: unknown event notification type: ${type}`)
    } else {
      throw new Error(`EventMapper: missing payload in notification event`)
    }
  }

  static toErrorEntity = (dto: EventErrorDto): ErrorEvent => {
    return { message: dto.message }
  }
}
