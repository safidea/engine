import type { IEvent } from '@adapter/api/configs/Event'
import type { Event } from '@domain/entities/Event'
import { ClickInEmailEventMapper } from './ClickInEmailMapper'
import { ClickEventMapper } from './ClickMapper'
import { FillEventMapper } from './FillMapper'
import { OpenEventMapper } from './OpenMapper'
import { PostEventMapper } from './PostMapper'
import { WaitForAutomationEventMapper } from './WaitForAutomationMapper'
import { WaitForTextEventMapper } from './WaitForTextMapper'

export class EventMapper {
  static toEntity(config: IEvent): Event {
    const { event } = config
    if (event === 'Click') return ClickEventMapper.toEntity(config)
    if (event === 'Open') return OpenEventMapper.toEntity(config)
    if (event === 'Fill') return FillEventMapper.toEntity(config)
    if (event === 'Post') return PostEventMapper.toEntity(config)
    if (event === 'ClickInEmail') return ClickInEmailEventMapper.toEntity(config)
    if (event === 'WaitForText') return WaitForTextEventMapper.toEntity(config)
    if (event === 'WaitForAutomation') return WaitForAutomationEventMapper.toEntity(config)
    throw new Error(`EventMapper: event not found: ${event}`)
  }

  static toManyEntities(configs: IEvent[]): Event[] {
    return configs.map((config) => this.toEntity(config))
  }
}
