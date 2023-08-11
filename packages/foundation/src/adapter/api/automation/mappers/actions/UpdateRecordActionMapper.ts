import { UpdateRecordAction } from '@domain/entities/automation/actions/UpdateRecordAction'
import { UpdateRecordActionDto } from '../../dtos/actions/UpdateRecordAction'
import { Table } from '@domain/entities/table/Table'

export class UpdateRecordActionMapper {
  static toEntity(updateRecordActionDto: UpdateRecordActionDto, tables: Table[]) {
    return new UpdateRecordAction(updateRecordActionDto.table, updateRecordActionDto.fields, tables)
  }

  static toDto(updateRecordAction: UpdateRecordAction): UpdateRecordActionDto {
    return {
      type: 'update_record',
      table: updateRecordAction.table,
      fields: updateRecordAction.fields,
    }
  }

  static toEntities(
    updateRecordActionDtos: UpdateRecordActionDto[],
    tables: Table[]
  ): UpdateRecordAction[] {
    return updateRecordActionDtos.map((updateRecordActionDto) =>
      this.toEntity(updateRecordActionDto, tables)
    )
  }

  static toDtos(updateRecordActions: UpdateRecordAction[]): UpdateRecordActionDto[] {
    return updateRecordActions.map((updateRecordAction) => this.toDto(updateRecordAction))
  }
}
