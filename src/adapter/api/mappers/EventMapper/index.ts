import type { Event as Config } from '@adapter/api/configs/Event'
import type { Event } from '@domain/entities/Event'
import { ClickMapper } from './ClickMapper'
import { ClickInEmailMapper } from './ClickInEmailMapper'
import { OpenMapper } from './OpenMapper'
import { FillMapper } from './FillMapper'
import { PostMapper } from './PostMapper'
import { WaitForTextMapper } from './WaitForTextMapper'
import { WaitForAutomationMapper } from './WaitForAutomationMapper'

export class EventMapper {
  static toEntity(config: Config): Event {
    const { event } = config
    if (event === 'Click') return ClickMapper.toEntity(config)
    if (event === 'Open') return OpenMapper.toEntity(config)
    if (event === 'Fill') return FillMapper.toEntity(config)
    if (event === 'Post') return PostMapper.toEntity(config)
    if (event === 'ClickInEmail') return ClickInEmailMapper.toEntity(config)
    if (event === 'WaitForText') return WaitForTextMapper.toEntity(config)
    if (event === 'WaitForAutomation') return WaitForAutomationMapper.toEntity(config)
    throw new Error(`EventMapper: event not found: ${event}`)
  }

  static toManyEntities(configs: Config[]): Event[] {
    return configs.map((config) => this.toEntity(config))
  }
}
