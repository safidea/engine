import { TextInputDto } from '@application/dtos/page/components/inputs/TextInputDto'
import { TextInput } from '@domain/entities/page/components/inputs/TextInput'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export function mapDtoToTextInput(textInputDto: TextInputDto, ui: IUIGateway): TextInput {
  const { label, field, placeholder } = textInputDto
  return new TextInput(field, ui.TextInputUI, label, placeholder)
}

export function mapTextInputToDto(textInput: TextInput): TextInputDto {
  const { label, field, placeholder } = textInput
  return {
    label,
    field,
    placeholder,
  }
}
