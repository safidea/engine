import { JSONSchemaType } from '@adapter/api/utils/AjvUtils'

export type RecordFieldValue = string | number | boolean | undefined | string[]

export interface RecordDto {
  [key: string]: RecordFieldValue
}

export const RecordDtoSchema: JSONSchemaType<RecordDto> = {
  type: 'object',
  additionalProperties: true,
  properties: {
    id: { type: 'string', nullable: true },
    created_time: { type: 'string', nullable: true },
    last_modified_time: { type: 'string', nullable: true },
    deleted_time: { type: 'string', nullable: true },
  },
}
