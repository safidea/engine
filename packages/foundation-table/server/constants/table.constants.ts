import { join } from 'path'

export const TYPES_PATH = join(__dirname, '../../types/index.ts')

export const DEFAULT_FIELDS = {
  id: {
    type: 'String',
    primary: true,
    default: 'cuid()',
  },
  created_at: {
    type: 'DateTime',
    default: 'now()',
  },
  updated_at: {
    type: 'DateTime',
    optional: true,
  },
  deleted_at: {
    type: 'DateTime',
    optional: true,
  },
}
