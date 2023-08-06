import { AutomationDto } from '@adapter/api/automation/dtos/AutomationDto'
import { Automation } from '@domain/entities/automation/Automation'
import { Table } from '@domain/entities/table/Table'

export class AutomationMapper {
  static toEntity(automationDto: AutomationDto, tables: Table[]): Automation {
    return new Automation(automationDto.name, automationDto.actions, tables)
  }

  static toDto(automation: Automation): AutomationDto {
    return {
      name: automation.name,
      actions: automation.actions,
    }
  }

  static toEntities(automationsDto: AutomationDto[], tables: Table[]): Automation[] {
    return automationsDto.map((automationDto) => this.toEntity(automationDto, tables))
  }

  static toDtos(automations: Automation[]): AutomationDto[] {
    return automations.map((automation) => this.toDto(automation))
  }
}
