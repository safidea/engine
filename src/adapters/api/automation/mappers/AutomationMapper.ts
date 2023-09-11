import { AutomationDto } from '@adapters/api/automation/dtos/AutomationDto'
import { Automation } from '@entities/app/automation/Automation'
import { Table } from '@entities/app/table/Table'
import { ILoggerSpi } from '@entities/spi/ILoggerSpi'
import { TriggerMapper } from './TriggerMapper'
import { ActionMapper } from './ActionMapper'
import { IStorageSpi } from '@entities/spi/IStorageSpi'
import { IConverterSpi } from '@entities/spi/IConverterSpi'
import { ITemplatingSpi } from '@entities/spi/ITemplatingSpi'

export interface AutomationMapperSpis {
  logger?: ILoggerSpi
  storage?: IStorageSpi
  converter?: IConverterSpi
  templating?: ITemplatingSpi
}

export class AutomationMapper {
  static toEntity(
    automationDto: AutomationDto,
    tables: Table[],
    spis: AutomationMapperSpis
  ): Automation {
    const trigger = TriggerMapper.toEntity(automationDto.trigger)
    const actions = ActionMapper.toEntities(automationDto.actions, tables, spis)
    return new Automation(automationDto.name, trigger, actions)
  }

  static toDto(automation: Automation): AutomationDto {
    const trigger = TriggerMapper.toDto(automation.trigger)
    const actions = ActionMapper.toDtos(automation.actions)
    return {
      name: automation.name,
      trigger,
      actions,
    }
  }

  static toEntities(
    automationsDto: AutomationDto[],
    tables: Table[],
    spis: AutomationMapperSpis
  ): Automation[] {
    return automationsDto.map((automationDto) => this.toEntity(automationDto, tables, spis))
  }

  static toDtos(automations: Automation[]): AutomationDto[] {
    return automations.map((automation) => this.toDto(automation))
  }
}
