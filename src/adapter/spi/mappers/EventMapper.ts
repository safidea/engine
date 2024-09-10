import type { ErrorEvent, NotificationEvent } from '@domain/services/Database'
import type { EventErrorDto, EventNotificationDto } from '../dtos/EventDto'

export class EventMapper {
  static toNotificationEntity = (dto: EventNotificationDto): NotificationEvent => {
    const { notification } = dto
    return { ...notification, recordId: notification.record_id }
  }

  static toErrorEntity = (dto: EventErrorDto): ErrorEvent => {
    return { message: dto.message }
  }
}
