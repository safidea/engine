import { CreateFileAction } from '@domain/entities/automation/actions/CreateFileAction'
import { CreateFileActionDto } from '../../dtos/actions/CreateFileAction'

export class CreateFileActionMapper {
  static toEntity(createFileActionDto: CreateFileActionDto, storage: any) {
    return new CreateFileAction(
      createFileActionDto.filename,
      createFileActionDto.input,
      createFileActionDto.output,
      createFileActionDto.template,
      storage
    )
  }

  static toDto(createFileAction: CreateFileAction): CreateFileActionDto {
    return {
      type: 'create_file',
      filename: createFileAction.filename,
      input: createFileAction.input,
      output: createFileAction.output,
      template: createFileAction.template,
    }
  }

  static toEntities(createFileActionDtos: CreateFileActionDto[], storage: any): CreateFileAction[] {
    return createFileActionDtos.map((createFileActionDto) => this.toEntity(createFileActionDto, storage))
  }

  static toDtos(createFileActions: CreateFileAction[]): CreateFileActionDto[] {
    return createFileActions.map((createFileAction) => this.toDto(createFileAction))
  }
}
