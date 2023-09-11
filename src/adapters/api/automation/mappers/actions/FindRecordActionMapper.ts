import { Table } from '@entities/app/table/Table'
import { ITemplatingSpi } from '@entities/spi/ITemplatingSpi'
import { FindRecordAction } from '@entities/app/automation/actions/FindRecordAction'
import { FindRecordActionDto } from '../../dtos/actions/FindRecordActionDto'

export class FindRecordActionMapper {
  static toEntity(
    findRecordActionDto: FindRecordActionDto,
    tables: Table[],
    templating: ITemplatingSpi
  ) {
    return new FindRecordAction(
      findRecordActionDto.name,
      findRecordActionDto.table,
      findRecordActionDto.recordId,
      tables,
      templating
    )
  }

  static toDto(findRecordAction: FindRecordAction): FindRecordActionDto {
    return {
      name: findRecordAction.name,
      type: 'find_record',
      table: findRecordAction.tableName,
      recordId: findRecordAction.recordId,
    }
  }

  static toEntities(
    findRecordActionDtos: FindRecordActionDto[],
    tables: Table[],
    templating: ITemplatingSpi
  ): FindRecordAction[] {
    return findRecordActionDtos.map((findRecordActionDto) =>
      this.toEntity(findRecordActionDto, tables, templating)
    )
  }

  static toDtos(findRecordActions: FindRecordAction[]): FindRecordActionDto[] {
    return findRecordActions.map((findRecordAction) => this.toDto(findRecordAction))
  }
}
