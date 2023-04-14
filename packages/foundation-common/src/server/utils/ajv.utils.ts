import Ajv from 'ajv'
import ajvKeywords from 'ajv-keywords'

const ajv = new Ajv({ strictTypes: false, allErrors: true })

export default ajvKeywords(ajv)
