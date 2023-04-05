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
