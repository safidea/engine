import { CreateFileAction } from '@domain/entities/automation/actions/CreateFileAction'
import { CreateFileActionDto } from '../../dtos/actions/CreateFileActionDto'
import { IStorageSpi } from '@domain/spi/IStorageSpi'

export class CreateFileActionMapper {
  static toEntity(createFileActionDto: CreateFileActionDto, storage: IStorageSpi, converter: any) {
    return new CreateFileAction(
      createFileActionDto.filename,
      createFileActionDto.input,
      createFileActionDto.output,
      createFileActionDto.template,
      createFileActionDto.bucket,
      storage,
      converter
    )
  }

  static toDto(createFileAction: CreateFileAction): CreateFileActionDto {
    return {
      type: 'create_file',
      filename: createFileAction.filename,
      input: createFileAction.input,
      output: createFileAction.output,
      template: createFileAction.template,
      bucket: createFileAction.bucket,
    }
  }

  static toEntities(
    createFileActionDtos: CreateFileActionDto[],
    storage: IStorageSpi,
    converter: any
  ): CreateFileAction[] {
    return createFileActionDtos.map((createFileActionDto) =>
      this.toEntity(createFileActionDto, storage, converter)
    )
  }

  static toDtos(createFileActions: CreateFileAction[]): CreateFileActionDto[] {
    return createFileActions.map((createFileAction) => this.toDto(createFileAction))
  }
}
