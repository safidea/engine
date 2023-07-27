import { AutomationDto } from '@application/dtos/AutomationDto'
import { Automation } from '@domain/entities/App'
import { Table } from '@domain/entities/Table'

export function mapDtoToAutomation(automationDto: AutomationDto, tables?: Table[]): Automation {
  const firstAction = automationDto.actions?.[0]
  const table = tables?.find((table) => table.name === firstAction.table)
  if (!table) {
    throw new Error(
      `table ${firstAction.table} in automation ${automationDto.name} is not defined in tables`
    )
  }
  const firstField = Object.keys(firstAction.fields ?? {})[0]
  if (!table.fields.some((field) => field.name === firstField))
    throw new Error('field X in automation A is not defined in table "invoices"')

  return {}
}
