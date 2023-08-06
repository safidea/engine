import { TextInputDto } from '@adapter/api/page/dtos/components/inputs/TextInputDto'
import { TextInput } from '@domain/entities/page/components/inputs/TextInput'
import { UI } from '@adapter/spi/ui/UI'

export class TextInputMapper {
  static toEntity(textInputDto: TextInputDto, ui: UI): TextInput {
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

  static toEntities(textInputDtos: TextInputDto[], ui: UI): TextInput[] {
    return textInputDtos.map((textInputDto) => this.toEntity(textInputDto, ui))
  }

  static toDtos(textInputs: TextInput[]): TextInputDto[] {
    return textInputs.map((textInput) => this.toDto(textInput))
  }
}
