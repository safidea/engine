import { TextInputDto } from '@adapters/api/page/dtos/components/inputs/TextInputDto'
import { TextInput } from '@entities/app/page/components/inputs/TextInput'
import { IUISpi } from '@entities/app/page/IUISpi'

export class TextInputMapper {
  static toEntity(textInputDto: TextInputDto, ui: IUISpi): TextInput {
    const { label, field, placeholder } = textInputDto
    return new TextInput(field, ui.TextInputUI, label, placeholder)
  }

  static toDto(textInput: TextInput): TextInputDto {
    const { label, field, placeholder } = textInput
    return {
      label,
      field,
      placeholder,
    }
  }

  static toEntities(textInputDtos: TextInputDto[], ui: IUISpi): TextInput[] {
    return textInputDtos.map((textInputDto) => this.toEntity(textInputDto, ui))
  }

  static toDtos(textInputs: TextInput[]): TextInputDto[] {
    return textInputs.map((textInput) => this.toDto(textInput))
  }
}
