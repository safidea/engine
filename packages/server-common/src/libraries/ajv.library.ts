import Ajv, { ValidateFunction } from 'ajv'
import ajvKeywords from 'ajv-keywords'

const ajv = new Ajv({ strictTypes: false, allErrors: true })

export type AJVValidateFunctionType = ValidateFunction
export default ajvKeywords(ajv)
