import type { ErrorEvent, NotificationEvent } from '@domain/services/Database'
import type { EventErrorDto, EventNotificationDto, NotificationDto } from '../dtos/EventDto'
import { RecordMapper } from './RecordMapper'

export class EventMapper {
  static toNotificationEntity = (dto: EventNotificationDto): NotificationEvent => {
    if (dto.payload) {
      const notification: NotificationDto = JSON.parse(dto.payload)
      const record = RecordMapper.toPersistedEntity(notification.record)
      if (!record.data) throw new Error(`EventMapper: missing data in notification event`)
      return {
        ...notification,
        record,
      }
    } else {
      throw new Error(`EventMapper: missing payload in notification event`)
    }
  }

  static toErrorEntity = (dto: EventErrorDto): ErrorEvent => {
    return { message: dto.message }
  }
}
