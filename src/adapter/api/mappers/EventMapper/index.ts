import type { Event as Config } from '@adapter/api/configs/Event'
import type { Event } from '@domain/entities/Event'
import { ClickMapper } from './ClickMapper'
import type { Logger } from '@domain/services/Logger'
import { ClickInEmailMapper } from './ClickInEmailMapper'
import { OpenMapper } from './OpenMapper'
import { FillMapper } from './FillMapper'
import { PostMapper } from './PostMapper'
import { WaitForTextMapper } from './WaitForTextMapper'
import { WaitForAutomationMapper } from './WaitForAutomationMapper'

interface Services {
  logger: Logger
}

export class EventMapper {
  static toEntity(config: Config, services: Services): Event {
    const { event } = config
    if (event === 'Click') return ClickMapper.toEntity(config, services)
    if (event === 'Open') return OpenMapper.toEntity(config, services)
    if (event === 'Fill') return FillMapper.toEntity(config, services)
    if (event === 'Post') return PostMapper.toEntity(config, services)
    if (event === 'ClickInEmail') return ClickInEmailMapper.toEntity(config, services)
    if (event === 'WaitForText') return WaitForTextMapper.toEntity(config, services)
    if (event === 'WaitForAutomation') return WaitForAutomationMapper.toEntity(config, services)
    throw new Error(`EventMapper: event not found: ${event}`)
  }

  static toManyEntities(configs: Config[], services: Services): Event[] {
    return configs.map((config) => this.toEntity(config, services))
  }
}
