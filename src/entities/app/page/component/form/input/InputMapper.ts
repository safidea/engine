import { InputDto } from '@adapters/api/page/dtos/components/InputDto'
import { TableInputMapper } from './input/TableInputMapper'
import { TextInputMapper } from './input/TextInputMapper'
import { TextInput } from '@entities/app/page/component/form/input/text/TextInput'
import { TableInput } from '@entities/app/page/component/form/input/table/TableInputComponent'
import { Input } from '@entities/app/page/component/form/input/Input'
import { IUISpi } from '@entities/app/page/IUISpi'
import { Table } from '@entities/app/table/Table'
import { MultipleLinkedRecordsField } from '@entities/app/table/field/MultipleLinkedRecordsField'
import { SingleLinkedRecordField } from '@entities/app/table/field/singleLinkedRecord/SingleLinkedRecordField'
import { SingleSelectRecordInputMapper } from './input/singleSelectRecord/SingleSelectRecordInputMapper'
import { SingleSelectRecordInput } from '@entities/app/page/component/input/SingleSelectRecordInput'
import { SingleSelectField } from '@entities/app/table/field/singleSelectField/SingleSelectField'
import { SingleSelectInputMapper } from './input/SingleSelectInputMapper'
import { SingleSelectInput } from '@entities/app/page/component/form/input/singleSelect/SingleSelectInputComponent'

export class InputMapper {
  static toEntity(inputDto: InputDto, ui: IUISpi, tableName: string, tables: Table[]): Input {
    const table = tables.find((table) => table.name === tableName)
    if (!table) {
      throw new Error(`table "${tableName}" is not defined in tables`)
    }
    const field = table.fields.find((field) => field.name === inputDto.field)
    if (!field) {
      throw new Error(`field "${inputDto.field}" is not defined in table ${table}`)
    }
    if (field instanceof MultipleLinkedRecordsField && 'columns' in inputDto) {
      const linkedTable = tables.find((table) => table.name === field.table)
      if (!linkedTable) {
        throw new Error(`linked table "${field.table}" is not defined in tables`)
      }
      return TableInputMapper.toEntity(inputDto, ui, linkedTable)
    }
    if (field instanceof SingleLinkedRecordField) {
      return SingleSelectRecordInputMapper.toEntity(inputDto, ui, field.table)
    }
    if (field instanceof SingleSelectField) {
      if (!('options' in inputDto)) throw new Error('options is required in SingleSelectInput')
      return SingleSelectInputMapper.toEntity(inputDto, ui)
    }
    return TextInputMapper.toEntity(inputDto, ui)
  }

  static toDto(input: Input): InputDto {
    const { type } = input
    if (input instanceof TextInput) {
      return TextInputMapper.toDto(input)
    }
    if (input instanceof TableInput) {
      return TableInputMapper.toDto(input)
    }
    if (input instanceof SingleSelectRecordInput) {
      return SingleSelectRecordInputMapper.toDto(input)
    }
    if (input instanceof SingleSelectInput) {
      return SingleSelectInputMapper.toDto(input)
    }
    throw new Error(`Invalid input type ${type}`)
  }

  static toEntities(
    inputDtos: InputDto[],
    ui: IUISpi,
    tableName: string,
    tables: Table[]
  ): Input[] {
    return inputDtos.map((inputDto) => this.toEntity(inputDto, ui, tableName, tables))
  }

  static toDtos(inputs: Input[]): InputDto[] {
    return inputs.map((input) => this.toDto(input))
  }
}
