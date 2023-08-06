import { AppDtoSchema } from '@adapter/api/app/AppDto'
import Ajv, { JSONSchemaType } from 'ajv'

const ajv = new Ajv()
const validate = ajv.compile(AppDtoSchema)

export { validate }
export type { JSONSchemaType }
