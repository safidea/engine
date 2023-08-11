import { AutomationDto } from '@adapter/api/automation/dtos/AutomationDto'
import { Automation } from '@domain/entities/automation/Automation'
import { Table } from '@domain/entities/table/Table'
import { ILogSpi } from '@domain/spi/ILogSpi'
import { TriggerMapper } from './TriggerMapper'
import { ActionMapper } from './ActionMapper'

export interface AutomationMapperSpis {
  log: ILogSpi
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
