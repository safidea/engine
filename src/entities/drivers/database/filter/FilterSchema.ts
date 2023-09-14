import { JSONSchemaType } from 'ajv'
import { FilterOptions } from './FilterOptions'
import { IsAnyOfFilterSchema } from './isAnyOf/IsAnyOfFilterSchema'
import { IsFilterSchema } from './is/IsFilterSchema'

export const FilterSchema: JSONSchemaType<FilterOptions> = {
  oneOf: [IsAnyOfFilterSchema, IsFilterSchema],
}
