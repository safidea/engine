import { AutomationDto } from '@adapter/api/automation/dtos/AutomationDto'
import { Automation } from '@domain/entities/automation/Automation'
import { Table } from '@domain/entities/table/Table'

export class AutomationMapper {
  static toEntity(automationDto: AutomationDto, tables: Table[], log?: any): Automation {
    return new Automation(automationDto.name, automationDto.trigger, automationDto.actions, tables, log)
  }

  static toDto(automation: Automation): AutomationDto {
    return {
      name: automation.name,
      trigger: automation.trigger,
      actions: automation.actions,
    }
  }

  static toEntities(automationsDto: AutomationDto[], tables: Table[], log: any): Automation[] {
    return automationsDto.map((automationDto) => this.toEntity(automationDto, tables, log))
  }

  static toDtos(automations: Automation[]): AutomationDto[] {
    return automations.map((automation) => this.toDto(automation))
  }
}
