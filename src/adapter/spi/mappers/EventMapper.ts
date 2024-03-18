import type { Event } from '@domain/services/Realtime'
import type { EventDto } from '../dtos/EventDto'
import { RecordMapper } from './RecordMapper'

export class EventMapper {
  static toEventEntity = (eventDto: EventDto): Event => {
    return {
      action: eventDto.action,
      table: eventDto.table,
      record: RecordMapper.toPersistedEntity(eventDto.record),
    }
  }
}
