import { CreateFileAction } from '@domain/entities/automation/actions/CreateFileAction'
import { CreateFileActionDto } from '../../dtos/actions/CreateFileActionDto'
import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { IConverterSpi } from '@domain/spi/IConverterSpi'
import { ITemplatingSpi } from '@domain/spi/ITemplatingSpi'

export class CreateFileActionMapper {
  static toEntity(
    createFileActionDto: CreateFileActionDto,
    storage: IStorageSpi,
    converter: IConverterSpi,
    templating: ITemplatingSpi
  ) {
    return new CreateFileAction(
      createFileActionDto.name,
      createFileActionDto.filename,
      createFileActionDto.input,
      createFileActionDto.output,
      createFileActionDto.template,
      createFileActionDto.bucket,
      storage,
      converter,
      templating,
      createFileActionDto.data
    )
  }

  static toDto(createFileAction: CreateFileAction): CreateFileActionDto {
    return {
      name: createFileAction.name,
      type: 'create_file',
      filename: createFileAction.filename,
      input: createFileAction.input,
      output: createFileAction.output,
      template: createFileAction.template,
      bucket: createFileAction.bucket,
      data: createFileAction.data,
    }
  }

  static toEntities(
    createFileActionDtos: CreateFileActionDto[],
    storage: IStorageSpi,
    converter: IConverterSpi,
    templating: ITemplatingSpi
  ): CreateFileAction[] {
    return createFileActionDtos.map((createFileActionDto) =>
      this.toEntity(createFileActionDto, storage, converter, templating)
    )
  }

  static toDtos(createFileActions: CreateFileAction[]): CreateFileActionDto[] {
    return createFileActions.map((createFileAction) => this.toDto(createFileAction))
  }
}
