import { FormDto } from '@application/dtos/page/components/FormDto'
import { Form } from '@domain/entities/page/components/Form'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { mapDtoToInput, mapInputToDto } from './InputMapper'
import { Table } from '@domain/entities/table/Table'

export function mapDtoToForm(formDto: FormDto, ui: IUIGateway, tables: Table[]): Form {
  const table = tables.find((table) => table.name === formDto.table)
  if (!table) {
    throw new Error(`table ${formDto.table} is not defined in tables`)
  }
  const inputs = formDto.inputs.map((inputDto) =>
    mapDtoToInput(inputDto, ui, table.fields, formDto.table)
  )
  return new Form(formDto.table, inputs, formDto.submit, ui.FormUI)
}

export function mapFormToDto(form: Form): FormDto {
  const inputs = form.inputs.map((input) => mapInputToDto(input))
  return {
    type: 'form',
    table: form.table,
    inputs,
    submit: form.submit,
  }
}
