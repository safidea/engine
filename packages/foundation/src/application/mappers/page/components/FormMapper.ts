import { FormDto } from '@application/dtos/page/components/FormDto'
import { InputDto } from '@application/dtos/page/components/InputDto'
import { Form } from '@domain/entities/page/components/Form'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export function mapDtoToForm(formDto: FormDto, ui: IUIGateway): Form {
  return new Form(formDto.table, formDto.inputs, formDto.submit, ui.FormUI)
}

export function mapFormToDto(form: Form): FormDto {
  return {
    type: 'form',
    table: form.table,
    inputs: form.inputs as InputDto[],
    submit: form.submit,
  }
}
