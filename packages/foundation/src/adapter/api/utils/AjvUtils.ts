import Ajv, { JSONSchemaType } from 'ajv'
import { AppDtoSchema } from '@adapter/api/app/dtos/AppDto'
import { RecordDtoSchema } from '@adapter/api/app/dtos/RecordDto'
import { SyncDtoSchema } from '@adapter/api/app/dtos/SyncDto'

const ajv = new Ajv()
export type { JSONSchemaType }

export const validateAppDto = ajv.compile(AppDtoSchema)
export const validateRecordDto = ajv.compile(RecordDtoSchema)
export const validateSyncDto = ajv.compile(SyncDtoSchema)