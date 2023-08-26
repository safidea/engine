import { SingleSelectInputDto } from '@adapter/api/page/dtos/components/inputs/SingleSelectInputDto'
import { SingleSelectInput } from '@domain/entities/page/components/inputs/SingleSelectInput'
import { IUISpi } from '@domain/spi/IUISpi'

export class SingleSelectInputMapper {
  static toEntity(singleSelectInputDto: SingleSelectInputDto, ui: IUISpi): SingleSelectInput {
    const { label, field, placeholder, options } = singleSelectInputDto
    return new SingleSelectInput(field, ui.SingleSelectInputUI, options, label, placeholder)
  }

  static toDto(singleSelectInput: SingleSelectInput): SingleSelectInputDto {
    const { label, field, placeholder, options } = singleSelectInput
    return {
      label,
      field,
      placeholder,
      options,
    }
  }

  static toEntities(
    singleSelectInputDtos: SingleSelectInputDto[],
    ui: IUISpi
  ): SingleSelectInput[] {
    return singleSelectInputDtos.map((singleSelectInputDto) =>
      this.toEntity(singleSelectInputDto, ui)
    )
  }

  static toDtos(singleSelectInputs: SingleSelectInput[]): SingleSelectInputDto[] {
    return singleSelectInputs.map((singleSelectInput) => this.toDto(singleSelectInput))
  }
}
