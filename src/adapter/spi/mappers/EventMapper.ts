import type { DatabaseErrorEvent, DatabaseNotificationEvent } from '@domain/services/Database'
import type { EventErrorDto, EventNotificationDto } from '../dtos/EventDto'

export class EventMapper {
  static toNotificationEntity = (dto: EventNotificationDto): DatabaseNotificationEvent => {
    const { notification } = dto
    return { ...notification, recordId: notification.record_id }
  }

  static toErrorEntity = (dto: EventErrorDto): DatabaseErrorEvent => {
    return new Error(dto.message)
  }
}
