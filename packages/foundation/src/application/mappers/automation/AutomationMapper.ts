import { AutomationDto } from '@application/dtos/automation/AutomationDto'
import { Automation } from '@domain/entities/automation/Automation'
import { Table } from '@domain/entities/table/Table'

export function mapDtoToAutomation(automationDto: AutomationDto, tables?: Table[]): Automation {
  return new Automation(automationDto.name, automationDto.actions, tables)
}

export function mapAutomationToDto(automation: Automation): AutomationDto {
  return {
    name: automation.name,
    actions: automation.actions,
  }
}
