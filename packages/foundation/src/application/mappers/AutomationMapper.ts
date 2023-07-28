import { AutomationDto } from '@application/dtos/AutomationDto'
import { Automation } from '@domain/entities/App'
import { Table } from '@domain/entities/Table'

export function mapDtoToAutomation(automationDto: AutomationDto, tables?: Table[]): Automation {
  // Note: at this stage, automationDto is actually of type unknown
  // => TODO: validate automationDto with AJV (or other) to garantee that it conforms with the structure of automationDto
  for (const action of automationDto.actions) {
    if (action.type !== 'updateTable') throw new Error(`unsupported action type: ${action.type}`)
    const table = tables?.find((table) => table.name === action.table)
    if (!table) {
      throw new Error(
        `table ${action.table} in automation ${automationDto.name} is not defined in tables`
      )
    }
    const fieldsNames = Object.keys(action.fields ?? {})
    const missingField = fieldsNames.find(
      (fieldName) => !table.fields.some((f) => f.name === fieldName)
    )
    if (missingField)
      throw new Error(`${missingField} in automation A is not defined in table "invoices"`)
  }

  return {}
}
