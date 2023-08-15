import { RecordDto } from '@adapter/spi/orm/dtos/RecordDto'

export interface TablesSyncDto {
  [key: string]: RecordDto[] | undefined
}
