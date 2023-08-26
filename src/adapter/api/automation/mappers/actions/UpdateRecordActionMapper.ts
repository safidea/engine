import { UpdateRecordAction } from '@domain/entities/automation/actions/UpdateRecordAction'
import { UpdateRecordActionDto } from '../../dtos/actions/UpdateRecordActionDto'
import { Table } from '@domain/entities/table/Table'
import { ITemplatingSpi } from '@domain/spi/ITemplatingSpi'

export class UpdateRecordActionMapper {
  static toEntity(
    updateRecordActionDto: UpdateRecordActionDto,
    tables: Table[],
    templating: ITemplatingSpi
  ) {
    return new UpdateRecordAction(
      updateRecordActionDto.name,
      updateRecordActionDto.table,
      updateRecordActionDto.recordId,
      updateRecordActionDto.fields,
      tables,
      templating
    )
  }

  static toDto(updateRecordAction: UpdateRecordAction): UpdateRecordActionDto {
    return {
      name: updateRecordAction.name,
      type: 'update_record',
      table: updateRecordAction.tableName,
      fields: updateRecordAction.fields,
      recordId: updateRecordAction.recordId,
    }
  }

  static toEntities(
    updateRecordActionDtos: UpdateRecordActionDto[],
    tables: Table[],
    templating: ITemplatingSpi
  ): UpdateRecordAction[] {
    return updateRecordActionDtos.map((updateRecordActionDto) =>
      this.toEntity(updateRecordActionDto, tables, templating)
    )
  }

  static toDtos(updateRecordActions: UpdateRecordAction[]): UpdateRecordActionDto[] {
    return updateRecordActions.map((updateRecordAction) => this.toDto(updateRecordAction))
  }
}
