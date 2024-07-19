import type { Event } from '@domain/services/Database'
import type { EventDto } from '../dtos/EventDto'
import { RecordMapper } from './RecordMapper'

export class EventMapper {
  static toEntity = (dto: EventDto): Event => {
    const { type } = dto
    if (type === 'PostgresRealtime') {
      return {
        ...dto,
        record: RecordMapper.toPersistedEntity(dto.record),
      }
    }
    if (type === 'SqliteRealtime') {
      return dto
    }
    throw new Error(`EventMapper: Unknown event type: ${type}`)
  }
}
