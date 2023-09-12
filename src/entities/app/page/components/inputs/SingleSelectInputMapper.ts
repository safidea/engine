import { SingleSelectInputDto } from '@adapters/api/page/dtos/components/inputs/SingleSelectInputDto'
import { SingleSelectInput } from '@entities/app/page/components/inputs/SingleSelectInput'
import { IUISpi } from '@entities/app/page/IUISpi'

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
